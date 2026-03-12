#!/usr/bin/env node

/**
 * bdc - Node command line utility for inspecting Bridge Designer files.
 * 
 * Node v24+ highly recommended.
 * 
 * Simplest usage (bash):
 * - `cd tools`
 * - `npm install` # Get's dependencies, but assumes you have Node.
 * - `npm run build`  # Generates dist/main.cjs with node shebang.
 * - `alias bdc $(pwd)/dist/main.cjs`  # Alias `bdc`. Do this in .bashrc if desired.
 * - `bdc` # prints help
 */
import 'reflect-metadata';
import { Args, Command, Options } from '@effect/cli';
import { NodeContext, NodeRuntime } from '@effect/platform-node';
import { Console, Effect, Option } from 'effect';
import { Injectable, ReflectiveInjector } from 'injection-js';
import { BridgeService, BridgeServiceSessionStateKey } from '../../app/shared/services/bridge.service';
import { ContestParametersService, SearchStringProvider } from '../../app/shared/services/contest-parameters.service';
import { DesignConditionsService } from '../../app/shared/services/design-conditions.service';
import { EventBrokerService } from '../../app/shared/services/event-broker.service';
import { InventoryService } from '../../app/shared/services/inventory.service';
import { BridgeCostService } from '../../app/shared/services/bridge-cost.service';
import { PersistenceService } from '../../app/shared/services/persistence.service';
import { BridgeSketchService } from '../../app/shared/services/bridge-sketch.service';
import { SessionStateService } from '../../app/features/session-state/session-state.service';
import { AnalysisService, AnalysisStatus } from '../../app/shared/services/analysis.service';
import { readFileSync } from 'fs';
import { Member } from '../../app/shared/classes/member.model';
import { withAlias } from '@effect/cli/Options';

/** Table of string for analysis status values. */
const ANALYSIS_STATUS_STRING_BY_STATUS = new Map<AnalysisStatus, string>([
  [AnalysisStatus.NONE, '<none>'],
  [AnalysisStatus.FAILS_SLENDERNESS, 'fails slenderness'],
  [AnalysisStatus.UNSTABLE, 'unstable'],
  [AnalysisStatus.FAILS_LOAD_TEST, 'fails load test'],
  [AnalysisStatus.PASSES, 'passes'],
]);

type MemberSynopsis = {
  number: number;
  maxTension: number;
  maxCompression: number;
  tensionStrength: number;
  compressionStrength: number;
  compressionStatus: string;
  tensionStatus: string;
};

/** Build a synopsis of a given member's analysis. */
function buildMemberSynopsis(member: Member): MemberSynopsis {
  return {
    number: member.number,
    maxTension: member.maxTension,
    maxCompression: member.maxCompression,
    tensionStrength: member.tensionStrength,
    compressionStrength: member.compressionStrength,
    compressionStatus: member.compressionStatus,
    tensionStatus: member.tensionStatus,
  };
}

const MEMBER_ANALYSIS_FIELDS: (keyof Member)[] = [] as const;
type MemberAnalysisFields = (typeof MEMBER_ANALYSIS_FIELDS)[number];

@Injectable()
class Subcommands {
  constructor(
    private readonly analysisService: AnalysisService,
    private readonly bridgeCostService: BridgeCostService,
    private readonly bridgeService: BridgeService,
    private readonly persistenceService: PersistenceService,
  ) {}

  listBridge(fileName: string, label: string): Effect.Effect<void> {
    const fileContent = readFileSync(fileName, 'utf8');
    const saveSetText = this.persistenceService.maybeDecrypt(fileContent);
    return Console.log(label + saveSetText);
  }

  analyzeBridge(fileName: string, label: string, withCost: boolean, withMembers: boolean): Effect.Effect<void> {
    const saveSetText = readFileSync(fileName, 'utf8');
    const saveSet = this.persistenceService.parseSaveSetText(saveSetText);
    this.bridgeService.setBridge(saveSet.bridge, saveSet.draftingPanelState);
    this.analysisService.analyzeQuietly({ populateBridgeMembers: true });
    const status = ANALYSIS_STATUS_STRING_BY_STATUS.get(this.analysisService.status);
    let result = Console.log(status);
    if (withCost) {
      const fixedCost = this.bridgeService.designConditions.siteCosts.totalFixedCost;
      const bridgeCost = this.bridgeCostService.bridgeCostModel.totalCost;
      result = Effect.andThen(result, Console.log((fixedCost + bridgeCost).toFixed(2)));
    }
    if (withMembers) {
      const memberData = this.bridgeService.bridge.members.map(buildMemberSynopsis);
      result = Effect.andThen(result, Console.log(memberData));
    }
    return result;
  }
}

function main(): void {
  // Top level command just accumulates contest parameters.
  const contestParamsOption = Options.text('contest-params').pipe(
    Options.withAlias('p'),
    Options.optional,
    Options.withDescription(
      'JSON contest parameters as in contest URL search string. Optionally URI encoded. Overrides file if present.',
    ),
  );
  const contestParamsFile = Options.fileText('contest-params-file').pipe(
    Options.withAlias('f'),
    Options.optional,
    Options.withDescription('File containing JSON contest parameters.'),
  );
  const bdc = Command.make('bdc', { contestParamsOption, contestParamsFile });

  // List subcommand.
  const filenames = Args.text({ name: 'filename' }).pipe(Args.repeated);
  const list = Command.make('list', { filenames }, ({ filenames }) => {
    return bdc.pipe(
      Effect.andThen(({ contestParamsOption, contestParamsFile }) => {
        const fallback = Option.orElse(() => Option.map(contestParamsFile, ([, content]) => content));
        const contestParams = Option.getOrNull(contestParamsOption.pipe(fallback));
        const subcommands: Subcommands = createInjector(contestParams).resolveAndInstantiate(Subcommands);
        return Effect.forEach(filenames, filename => {
          const label = filenames.length === 1 ? '' : filename + ':\n';
          return subcommands.listBridge(filename, label);
        });
      }),
    );
  });

  // Analyze subcommand.
  const cost = Options.boolean('cost').pipe(withAlias('c'), Options.withDescription('Include total cost.'));
  const members = Options.boolean('members').pipe(
    Options.withAlias('m'),
    Options.withDescription('Include member synopses.'),
  );
  const analyze = Command.make('analyze', { filenames, cost, members }, ({ filenames, cost, members }) => {
    return bdc.pipe(
      Effect.andThen(({ contestParamsOption, contestParamsFile }) => {
        const fallback = Option.orElse(() => Option.map(contestParamsFile, ([, content]) => content));
        const contestParams = Option.getOrNull(contestParamsOption.pipe(fallback));
        const subcommands: Subcommands = createInjector(contestParams).resolveAndInstantiate(Subcommands);
        return Effect.forEach(filenames, filename => {
          const label = filenames.length === 1 ? '' : filename + ':\n';
          return subcommands.analyzeBridge(filename, label, cost, members);
        });
      }),
    );
  });

  const command = bdc.pipe(Command.withSubcommands([list, analyze]));
  const cli = Command.run(command, {
    name: 'Bridge Design Contest CLI',
    version: 'v1.0.0',
  });

  Effect.suspend(() => cli(process.argv)).pipe(
    Effect.provide(NodeContext.layer),
    Effect.tapError(Console.error),
    NodeRuntime.runMain,
  );
}

/**
 * Builds an injector of BD entities we need. Most provided values are dummies
 * for dependencies that aren't actually used. Changes to bridge designer service
 * constructors can break this. Compile with --minify removed from scripts: build
 * entry in package.json for useful error messages.
 */
function createInjector(contestParamsOption: string | null): ReflectiveInjector {
  return ReflectiveInjector.resolveAndCreate([
    AnalysisService,
    BridgeCostService,
    BridgeService,
    { provide: BridgeServiceSessionStateKey, useValue: {} },
    { provide: BridgeSketchService, useValue: {} },
    ContestParametersService,
    DesignConditionsService,
    EventBrokerService,
    InventoryService,
    PersistenceService,
    { provide: SearchStringProvider, useValue: { value: contestParamsOption, verbose: false } },
    { provide: SessionStateService, useValue: { register: () => undefined } },
  ]);
}

if (require.main === module) {
  main();
}
