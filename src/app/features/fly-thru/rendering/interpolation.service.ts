import { Injectable } from '@angular/core';
import { vec2 } from 'gl-matrix';

/** Container for logic concerned with interpolating load displacements for animations. */
@Injectable({ providedIn: 'root' })
export class InterpolationService {

  constructor() { }

  public getLoadPt(pt: vec2 = vec2.create()): vec2 {
    return pt;
  }

  public getLoadLookDir(v: vec2 = vec2.create()): vec2 {
    return v;
  }
}
