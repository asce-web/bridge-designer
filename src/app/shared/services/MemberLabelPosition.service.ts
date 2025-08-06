import { Injectable } from '@angular/core';
import { BridgeService } from './bridge.service';
import { Member } from '../classes/member.model';
import { step } from '../core/runge-kutta';
import { DesignConditions } from './design-conditions.service';

type MemberConfig = {
  member: Member;
  length: number;
  halfLength: number;
  lox: number;
  ux: number;
  uy: number;
};

@Injectable({ providedIn: 'root' })
export class MemberLabelPositionService {
  constructor(private readonly bridgeService: BridgeService) {}

  // Allocate worst case array space  one time for simplicity. Only a few kilobytes.
  private readonly xa = new Float64Array(2 * DesignConditions.MAX_MEMBER_COUNT);
  private readonly xb = new Float64Array(2 * DesignConditions.MAX_MEMBER_COUNT);
  private readonly xTmp = new Float64Array(2 * DesignConditions.MAX_MEMBER_COUNT);
  private readonly yTmp = new Float64Array(2 * DesignConditions.MAX_MEMBER_COUNT);
  private readonly configs: MemberConfig[] = Array.from(
    { length: DesignConditions.MAX_MEMBER_COUNT },
    () => ({}) as MemberConfig,
  );

  /**
   * Gets label positions as distance from joint `a` of each member. IF a result vector is furnished, it must
   * _twice_ the number of members in the bridge. The upper half contains velocities in the
   * spring system used for the result.
   */
  public get labelPositions(): Float64Array {
    const members = this.bridgeService.bridge.members;
    members.forEach((member, index) => {
      const c = this.configs[index];
      c.member = member;
      c.ux = member.b.x - member.a.x;
      c.uy = member.b.y - member.a.y;
      c.length = Math.hypot(c.ux, c.uy);
      c.halfLength = c.length * 0.5;
      c.ux /= c.length;
      c.uy /= c.length;
      // Start each label at a small random fraction from member center and zero velocity.
      this.xa[index] = c.halfLength * (1 + 0.1 * (2 * Math.random() - 1));
      this.xa[index + members.length] = 0;
    });
    // Heuristic time step must be small enough to be stable, but larger is faster.
    const h = 0.01;
    // xa was initialized, so must be the initial x.
    let x = this.xa;
    let xNew = this.xb;
    for (let i = 0; i < 1000; ++i) {
      step(xNew, x, 0, h, (y, x) => this.findDerivatives(y, x, members.length), 2 * members.length, this.xTmp, this.yTmp);
      [xNew, x] = [x, xNew];
      // Stop when velocities are small. Units are meters per 1/h steps.
      if (MemberLabelPositionService.isNearZero(x, members.length, 0.03)) {
        return x;
      }
    }
    console.log('RK4 exploded');
    members.forEach((member, index) => x[index] = 0.5 * member.length);
    return x;
  }

  private static isNearZero(x: Float64Array, start: number, tolerance: number, end: number = x.length): boolean {
    for (let i = start; i < end; ++i) {
      if (Math.abs(x[i]) > tolerance) {
        return false;
      }
    }
    return true;
  }

  // State vector is [positions x | velocities v]
  private findDerivatives(y: Float64Array, x: Float64Array, n: number): void {
    const drag = 5; // spring damping
    const ka = 8;   // attraction to member centers
    const kr = 4;   // repulsion between pairs of labels
    const km = 0.75;   // repulsion between  labels and members
    for (let ix = 0, iv = ix + n; ix < n; ++ix, ++iv) {
      y[ix] = x[iv];
    }
    for (let i = 0, iv = i + n; i < n; ++i, ++iv) {
      const mi = this.configs[i];
      const mit = x[i];
      const v = x[iv];
      y[iv] = ka * (mi.halfLength - mit) - drag * v;
    }
    // TODO: All pairs is probably overkill. Try precomputing those with overlapping bb's.
    for (let i = 0, iv = i + n; i < n - 1; ++i, ++iv) {
      const mi = this.configs[i];
      const mit = x[i];
      const lix = mi.member.a.x + mit * mi.ux;
      const liy = mi.member.a.y + mit * mi.uy;
      for (let j = i + 1, jv = j + n; j < n; ++j, ++jv) {
        const mj = this.configs[j];
        const mjt = x[j];
        const ljx = mj.member.a.x + mjt * mj.ux;
        const ljy = mj.member.a.y + mjt * mj.uy;
        const ldx = ljx - lix;
        const ldy = ljy - liy;
        const force = -kr / (ldx * ldx + ldy * ldy);
        let ufx = ljx - lix;
        let ufy = ljy - liy;
        const fLength = Math.hypot(ufx, ufy);
        ufx /= fLength;
        ufy /= fLength;
        y[iv] += force * (ufx * mi.ux + ufy * mi.uy);
        y[jv] -= force * (ufx * mj.ux + ufy * mj.uy);

        y[iv] += labelMemberForce(lix, liy, mj, mi);
        y[jv] += labelMemberForce(ljx, ljy, mi, mj);
      }
    }
    function labelMemberForce(lx: number, ly: number, oc: MemberConfig, lc: MemberConfig) {
      const t = (oc.ux * (lx - oc.member.a.x) + oc.uy * (ly - oc.member.a.y)) / (oc.ux * oc.ux + oc.uy * oc.uy);
      if (t < 0 || t > oc.length) {
        return 0;
      }
      const px = lx - (oc.member.a.x + t * oc.ux);
      const py = ly - (oc.member.a.y + t * oc.uy);
      return Math.min(km / (px * px + py * py), 1000) * (px * lc.ux + py * lc.uy);
    }
  }
}
