import { Injectable } from '@angular/core';

/** Parameters that can be altered for contests. Update validator if adding new types. */
export type ContestParameters = {
  /** Parameters version number to support future changes. */
  version: number;
  /** Whether the parameters are patched wrt the default. */
  isPatched: boolean;
  anchorageCostPer: number;
  archIncrementalCostPerDeckPanel: number;
  bridgeVersion: number;
  carbonSteelCostPerKg: [number, number]; // [bar, tube]
  connectionFee: number;
  contestName: string;
  deckCostPerPanelHiStrength: number;
  deckCostPerPanelMedStrength: number;
  encryptionKey: string; // empty string means unencrypted
  excavationCostRate: number;
  heavyAxleLoads: [number, number]; // [front, rear]
  lowAlloySteelCostPerKg: [number, number]; // [bar, tube]
  pierBaseCost: number;
  pierCostPerDeckPanel: number;
  productFee: number;
  quenchedAndTemperedSteelCostPerKg: [number, number]; // [bar, tube]
  standardAbutmentBaseCost: number;
  standardAbutmentCostPerDeckPanel: number;
  standardAxleLoads: [number, number]; // [front, rear]
};

/**
 * Contest parameters used when none are explicitly specified.
 * THESE CAN'T BE CHANGED without affecting old bridge files
 * lacking stored parameters. I.e. if we do change them,
 * the old files must be rejected by the parser.
 */
export const DEFAULT_CONTEST_PARAMETERS: ContestParameters = {
  version: 1,
  isPatched: false,
  anchorageCostPer: 6000,
  archIncrementalCostPerDeckPanel: 3300,
  bridgeVersion: 2024,
  carbonSteelCostPerKg: [4.3, 6.3],
  connectionFee: 400,
  contestName: '',
  deckCostPerPanelHiStrength: 5100,
  deckCostPerPanelMedStrength: 4700,
  encryptionKey: '',
  excavationCostRate: 1,
  heavyAxleLoads: [137, 137],
  lowAlloySteelCostPerKg: [5.6, 7.0],
  pierBaseCost: 0,
  pierCostPerDeckPanel: 4500,
  productFee: 1000,
  quenchedAndTemperedSteelCostPerKg: [6.0, 7.7],
  standardAbutmentBaseCost: 6000,
  standardAbutmentCostPerDeckPanel: 500,
  standardAxleLoads: [71, 181],
} as const;

@Injectable({ providedIn: 'root' })
export class SearchStringProvider {
  /** Whether merge results will be logged. */
  public readonly verbose = true;
  
  /** Search string value to be used for contest parameters merged with default. */
  public get value(): string | null {
    return new URLSearchParams(window.location.search).get('p');
  }
}

@Injectable({ providedIn: 'root' })
export class ContestParametersService {
  public readonly parameters: ContestParameters;

  /** Map from search string aliases to parameter attribute names. Aliases with underscore not settable. */
  private readonly fieldsByAlias: { [key: string]: keyof ContestParameters } = (obj => {
    // Apparently can't check completeness at compile time, so do it here.
    if (new Set(Object.values(obj)).size !== Object.keys(DEFAULT_CONTEST_PARAMETERS).length) throw 'missing alias';
    return obj;
  })({
    _i: 'isPatched',
    _v: 'version',
    a: 'anchorageCostPer',
    ab: 'standardAbutmentBaseCost',
    ap: 'standardAbutmentCostPerDeckPanel',
    c: 'connectionFee',
    dh: 'deckCostPerPanelHiStrength',
    dm: 'deckCostPerPanelMedStrength',
    f: 'productFee',
    k: 'encryptionKey',
    p: 'pierCostPerDeckPanel',
    pb: 'pierBaseCost',
    n: 'contestName',
    r: 'archIncrementalCostPerDeckPanel',
    sa: 'lowAlloySteelCostPerKg',
    sc: 'carbonSteelCostPerKg',
    sq: 'quenchedAndTemperedSteelCostPerKg',
    vb: 'bridgeVersion',
    x: 'excavationCostRate',
    xh: 'heavyAxleLoads',
    xs: 'standardAxleLoads',
  } as const);

  /** Map from parameter attribute names to search string short aliases. Keys checked at run time. */
  private readonly aliasesByField = Object.fromEntries(Object.entries(this.fieldsByAlias).map(([k, v]) => [v, k]));

  constructor(searchStringProvider: SearchStringProvider) {
    // Set parameter defaults.
    this.parameters = { ...DEFAULT_CONTEST_PARAMETERS };
    // Patch with contents of JSON in search parameter "p" if present.
    const patchJson = searchStringProvider.value;
    if (patchJson !== null) {
      try {
        const aliasedEntries = Object.entries(JSON.parse(patchJson)).filter(([alias]) => !alias.startsWith('_'));
        const deAlias = ([alias, value]: [string, any]): [string, any] => [this.fieldsByAlias[alias], value];
        const deAliasedEntries = aliasedEntries.map(deAlias);
        this.validatePatchEntries(deAliasedEntries);
        Object.assign(this.parameters, Object.fromEntries(deAliasedEntries));
        this.parameters.isPatched = true;
      } catch (err) {
        console.error('contest parameter patch not applied', err, patchJson);
      }
      if (searchStringProvider.verbose) {
        console.log('effective contest parameters', JSON.stringify(this.parameters, undefined, 2));
      }
    }
  }

  /** Returns a search string for given parameters, defaulting to the service's. Value is not URI escaped. */
  public toSearchString(parameters: ContestParameters = this.parameters): string {
    const aliasedEntries = Object.entries(parameters).map(([field, value]) => [this.aliasesByField[field], value]);
    return JSON.stringify(Object.fromEntries(aliasedEntries));
  }

  /** Converts a search string to contest parameters. Unchecked: any valid JSON will produce a result. */
  public fromSearchString(s: string): ContestParameters {
    const aliasedEntries = Object.entries(JSON.parse(s));
    const deAliasedEntries = aliasedEntries.map(([alias, value]) => [this.fieldsByAlias[alias], value]);
    return Object.fromEntries(deAliasedEntries);
  }

  /** A lightweight validator of patch objects. Compares types against default parameters. */
  private validatePatchEntries(entries: [string, any][]): void {
    for (const [key, objValue] of entries) {
      const parametersValue = (DEFAULT_CONTEST_PARAMETERS as any)[key];
      if (parametersValue === undefined) {
        throw `unknown key ${key}`;
      }
      if (typeof objValue != typeof parametersValue) {
        throw `type mismatch ${objValue} vs ${parametersValue}`;
      } else if (Array.isArray(parametersValue)) {
        if (!Array.isArray(objValue)) {
          throw `not an array ${objValue}`;
        }
        if (objValue.length !== parametersValue.length) {
          throw `length mismatch ${objValue} vs ${parametersValue}`;
        }
        if (objValue.some((objElement, i) => typeof objElement !== typeof parametersValue[i])) {
          throw `element mismatch ${objValue} vs ${parametersValue}`;
        }
      }
    }
  }
}
