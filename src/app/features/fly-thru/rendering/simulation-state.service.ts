import { Injectable } from '@angular/core';
import { InterpolationService } from './interpolation.service';
import { AnalysisService } from '../../../shared/services/analysis.service';
import { vec2 } from 'gl-matrix';

const enum SimulationPhase {
  UNSTARTED,
  DEAD_LOADING,
  MATERIALIZING,
  TRAVERSING,
  DEMAERIALIZING,
  FAILING,
}

/** Container for state of the load simulation. */
@Injectable({ providedIn: 'root' })
export class SimulationStateService {
  //private static readonly DEAD_LOADING_MILLIS = 1200;
  //private static readonly MATERIALIZING_MILLIS = 800;

  public readonly wayPoint = vec2.create();
  public readonly rotation = vec2.create();

  private phase: SimulationPhase = SimulationPhase.UNSTARTED;
  private clockMillis: number = 0;

  public readonly interpolator;

  constructor(
    analysisService: AnalysisService,
    interpolationService: InterpolationService,
  ) {
    this.interpolator = interpolationService.createInterpolator(analysisService);
  }

  public get loadAlpha(): number {
    return 1;
  }

  public start(clockMillis: number): void {
    this.clockMillis = clockMillis;
    this.phase =  SimulationPhase.DEAD_LOADING;
  }

  public advance(clockMillis: number): void {
    if (clockMillis <= this.clockMillis) {
      return;
    }
    this.clockMillis = clockMillis;
    switch (this.phase) {
      case SimulationPhase.DEAD_LOADING:
        break;
      case SimulationPhase.MATERIALIZING:
        break;
      case SimulationPhase.TRAVERSING:
        break;
      case SimulationPhase.DEMAERIALIZING:
        break;
      case SimulationPhase.FAILING:
        break;
    }
  }
}
