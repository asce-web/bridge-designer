import { Injectable } from '@angular/core';
import { DesignConditions, DesignConditionsService } from './design-conditions.service';
import { ContestParametersService } from './contest-parameters.service';
import { BridgeModel } from '../classes/bridge.model';
import { BridgeService } from './bridge.service';

/** Single design conditions contest bridge creation and management. */
@Injectable({ providedIn: 'root' })
export class ContestBridgeService {
  constructor(
    private readonly bridgeService: BridgeService,
    private readonly contestParametersService: ContestParametersService,
    private readonly designConditionsService: DesignConditionsService,
  ) {}

  /** Returns design conditions specified by parameters or undefined if none. */
  public get contestBridge(): BridgeModel | undefined {
    const [conditions, key] = this.contestDesignConditions;
    if (conditions) {
      return this.bridgeService.createBridge(conditions);
    }
    if (key !== undefined) {
      console.error(`Bad contest design conditions spec ${key}`);
    }
    return undefined;
  }

  /** Returns design conditions given by contest parameters, if any, along with the spec key, a tag or code long. */
  private get contestDesignConditions(): [conditions: DesignConditions | undefined, key: string | number | undefined] {
    const parameters = this.contestParametersService.parameters;
    const tag = parameters.designConditionsTag;
    if (tag !== '') {
      return [this.designConditionsService.getStandardConditionsForTag(tag), tag];
    }
    const code = parameters.designConditionsCode;
    if (code !== 0) {
      return [this.designConditionsService.getConditionsForCodeLong(code), code];
    }
    return [undefined, undefined];
  }
}
