import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TerrainService {
  constructor() { }

  public getElevationAt(x: number, z: number): number {
    console.log(x, z);
    return 0;
  }
}
