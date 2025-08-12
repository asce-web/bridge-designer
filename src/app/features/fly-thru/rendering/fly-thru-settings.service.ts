import { Injectable } from '@angular/core';
import { EventBrokerService } from '../../../shared/services/event-broker.service';

export const DEFAULT_FLY_THRU_SETTINGS: FlyThruSettings = {
  brightness: 50,
  speed: 30,
};

export type FlyThruSettings = {
  brightness?: number;
  speed?: number;
  noAbutments?: boolean;
  noExaggeration?: boolean;
  noMemberColors?: boolean;
  noShadows?: boolean;
  noSky?: boolean;
  noTerrain?: boolean;
  noTruck?: boolean;
  noWindTurbine?: boolean;
};

/** Holder for fly-thru settings for injection into all using services and componets. */
@Injectable({ providedIn: 'root' })
export class FlyThruSettingsService {
  private static readonly KM_PER_HOUR_TO_M_PER_MILLI = 1 / 3600;
  public readonly settings: FlyThruSettings = { brightness: 100, speed: 30 };
  public speedMetersPerMilli: number = 0;
  public elapsedMillisPerMeter: number = 0;

  constructor(eventBrokerService: EventBrokerService) {
    this.updateTruckSpeedInfo();
    eventBrokerService.flyThruSettingsChange.subscribe(eventInfo => {
      Object.assign(this.settings, eventInfo.data);
      this.updateTruckSpeedInfo();
    });
  }

  private updateTruckSpeedInfo() {
    this.speedMetersPerMilli = this.settings.speed! * FlyThruSettingsService.KM_PER_HOUR_TO_M_PER_MILLI;
    this.elapsedMillisPerMeter = 1 / this.speedMetersPerMilli;
  }

  public get exaggeration(): number {
    return this.settings.noExaggeration ? 1 : 20;
  }

  public get brightness(): number {
    return 0.75 + this.settings.brightness! * 0.0075; // 0.75 to 1.5
  }
}
