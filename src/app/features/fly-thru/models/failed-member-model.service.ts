import { Injectable } from '@angular/core';
import { mat4, vec2 } from 'gl-matrix';

export type FailedMemberMeshData = {

};

@Injectable({ providedIn: 'root' })
export class FailedMemberModelService {
  /** Widths of parabolas with unit arc length, where corresponding element of PARABOLA_HEIGHT gives the height. */
  private static readonly PARABOLA_WIDTHS = [
    0.0, 0.0625, 0.125, 0.15625, 0.1875, 0.21875, 0.25, 0.28125, 0.3125, 0.34375, 0.375, 0.40625, 0.4375, 0.46875, 0.5,
    0.53125, 0.5625, 0.59375, 0.625, 0.65625, 0.6875, 0.71875, 0.75, 0.78125, 0.8125, 0.84375, 0.875, 0.90625, 0.9375,
    0.96875, 0.984375, 0.992188, 1.0,
  ];
  /** Hieghts of parabolas with unit arc length, where corresponding element of PARABOLA_WIDTH gives the width. */
  private static readonly PARABOLA_HEIGHTS = [
    0.5, 0.497717, 0.492161, 0.488378, 0.483979, 0.478991, 0.473431, 0.46731, 0.460633, 0.453402, 0.445614, 0.437259,
    0.428326, 0.418797, 0.40865, 0.397857, 0.386383, 0.374182, 0.361201, 0.347371, 0.332606, 0.316796, 0.299798,
    0.28142, 0.261396, 0.239344, 0.214672, 0.186382, 0.152526, 0.108068, 0.076484, 0.054105, 0.0,
  ];
  /** Pattern for x-y buckled member segments.  */
  /*
  // prettier-ignore
  private static SEGMENT_POINTS = new Float32Array([
    0, 0,
    1, 0,
    1, 1,
    0, 1,
  ]);

  constructor() {}

  createForCurrentFailedMembers(): FailedMemberMeshData {
    return {};
  }

  buildParabola(points: Float32Array)

  buildSegmentTransformsForFailedMember(member: Member, buckledLength: number) {
    const height = FailedMemberModelService.getParabolaHeight(buckledLength, member.length);
  }
*/
  /**
   * Returns a matrix that takes a unit 2d rectangle in the x-y plane to the given trapezoid:
   *
   *  p2+t(p0-p1)           p2
   *    o-------------------o
   *   /                     \
   *  o-----------------------o
   * p0                        p1
   *
   * As shown, the fourth point is defined by parameter t and the other three points.  If you have a
   * fourth point, p3, find t with:
   *
   *      /  (x3 - x2) / (x0 - x1)   if |x0-x1| > |y0-y1|,
   * t = <
   *      \  (y3 - y2) / (y0 - y1)   otherwise
   *
   * The z-coordinate of the transformed 4d point is the input unchanged. For this to be useful,
   * "perspective" division must be applied only to x and y, presumably in a special shader.
   *
   * Notes:
   * Math is based on the general technique of this OpenCV method. We thank the author(s):
   *
   * https://github.com/opencv/opencv/blob/11b020b9f9e111bddd40bffe3b1759aa02d966f0/modules/imgproc/src/imgwarp.cpp#L3001
   *
   * Code below is from expanding the linear system with (xi,yi) of the unit square, then solving symbolically with
   * wxmaxima. I'm sure there's an elegant way to get it by hand.
   */
  // visible-for-testing
  buildSegmentTransform(out: mat4, p0: vec2, p1: vec2, p2: vec2, t: number): mat4 {
    const u0 = p0[0];
    const v0 = p0[1];
    const u1 = p1[0];
    const v1 = p1[1];
    const u2 = p2[0];
    const v2 = p2[1];
    const s = 1 / t;

    // prettier-ignore
    return mat4.set(
      out, 
      u1 - u0,           v1 - v0,           0, 0,           // column 0
      (u2 - t * u1) * s, (v2 - t * v1) * s, 0, (1 - t) * s, // column 1
      0,                 0,                 1, 0,           // column 2
      u0,                v0,                0, 1,           // column 3
    );
  }

  // visible-for-testing
  static getParabolaHeight(buckledLength: number, unloadedLength: number): number {
    if (unloadedLength === 0) {
      return 0;
    }
    const widths = FailedMemberModelService.PARABOLA_WIDTHS;
    const heights = FailedMemberModelService.PARABOLA_HEIGHTS;
    const unitArcWidth = Math.min(buckledLength / unloadedLength, 1);
    // Invariant a[lo] < x <= a[hi].
    const index = FailedMemberModelService.searchFloor(unitArcWidth, widths);
    // Handle floor at top of width range.
    if (index === widths.length - 1) {
      return 0;
    }
    // Interpolate
    const t = (unitArcWidth - widths[index]) / (widths[index + 1] - widths[index]);
    const h0 = heights[index];
    return unloadedLength * (h0 + (heights[index + 1] - h0) * t);
  }

  /**
   * Returns the index of the greatest element of `a` not greater than `x`.
   * Assumes that `a` is sorted and `x` in the range of `a`.
   */
  // visible-for-testing
  static searchFloor(x: number, a: number[]): number {
    let lo = 0;
    let hi = a.length - 1;
    // Find two adjacent elements that must include the search value.
    while (hi - lo > 1) {
      const mid = (hi + lo) >>> 1;
      const aMid = a[mid];
      if (x > aMid) {
        lo = mid;
      } else if (x < aMid) {
        hi = mid;
      } else {
        return mid;
      }
    }
    // Determine which of the bracket ends is the answer.
    return a[hi] === x ? hi : lo;
  }
}
 