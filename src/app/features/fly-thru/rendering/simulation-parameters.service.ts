import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SimulationParametersService {
  public exaggeration: number = 1;
  public speedKph: number = 15;
}
