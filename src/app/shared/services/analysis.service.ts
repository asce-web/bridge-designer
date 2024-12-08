import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AnalysisService {

  constructor() { }

}

export class Analysis {

}

/** Summary of the analysis, possibly supporting a pass or fail. */
export class AnalysisSummary {
  public readonly forceStrengthRatios: ForceStrengthRatios[] = [];

  public setForceStrengthRatio(index: number, compression: number, tension: number): void {
    this.forceStrengthRatios[index] = new ForceStrengthRatios(compression, tension);
  }

  public clear(): void {
    this.forceStrengthRatios.length = 0;
  }
}

export class ForceStrengthRatios {
  constructor(public readonly compression: number, public readonly tension: number) { }
}
