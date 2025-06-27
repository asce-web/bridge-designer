import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PierModelService {
  private static readonly POSITIONS = new Float32Array();
  private static readonly NORMALS = new Float32Array();
  private static readonly TEX_COORDS = new Float32Array();
  private static readonly INDICES = new Uint16Array();

  constructor() {}

  buildMeshDataForPier() {
    let ip = 0;
    this.addPrism = (w: number, h: number, d: number, c: number, taper: number) {

    }
  }
}
