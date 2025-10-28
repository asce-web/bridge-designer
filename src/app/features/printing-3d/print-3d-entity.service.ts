import { Injectable } from '@angular/core';
import { Manifold, Mat4, SimplePolygon, Vec2 } from 'manifold-3d';
import * as ManifoldTypes from 'manifold-3d/manifold-encapsulated-types';
import { BridgeService } from '../../shared/services/bridge.service';
import { GussetsService } from '../../shared/services/gussets.service';

type Mat2x3 = [number, number, number, number, number, number];

/** Returns whether the given transform reverses the winding order of polygons when applied.*/
function isReverseWinding(a: Mat2x3): boolean {
  return a[0] * a[3] < a[1] * a[2];
}

function transformVec2(a: Mat2x3, x: number, y: number, w: number = 1): Vec2 {
  return [a[0] * x + a[2] * y + a[4] * w, a[1] * x + a[3] * y + a[5] * w];
}

@Injectable({ providedIn: 'root' })
export class Print3dEntityService {
  private manifoldInstance!: typeof ManifoldTypes.Manifold;

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly gussetsService: GussetsService,
  ) {}

  public buildTruss(xyTransform: Mat2x3, minFeatureSize: number): Manifold | undefined {
    let truss!: Manifold;
    const add = (newComponent: Manifold): void => {
      if (truss) {
        const oldTruss = truss;
        truss = truss.add(newComponent);
        oldTruss.delete();
      } else {
        truss = newComponent;
      }
    };
    for (const member of this.bridgeService.bridge.members) {
      const size = member.materialSizeMm * 0.001;
      const halfsize = size * 0.5;
      const [ax, ay] = transformVec2(xyTransform, member.a.x, member.a.y);
      const [bx, by] = transformVec2(xyTransform, member.b.x, member.b.y);
      let dx = bx - ax;
      let dy = by - ay;
      let len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      // Rotate about to correct angle after shifting down and right by 1/2 member size.
      const tx = ax + halfsize * (dx + dy);
      const ty = ay + halfsize * (dy - dx);
      // prettier-ignore
      const m: Mat4 = [
          dx, dy, 0, 0, // column 0
          -dy, dx, 0, 0, // column 1
          0, 0, 1, 0, // column 2
          tx, ty, 0, 1, // column 3
        ];
      const memberAtOrigin = this.manifoldInstance.cube([member.lengthM - size, size, size]);
      add(memberAtOrigin.transform(m));
      memberAtOrigin.delete();
    }
    const d = 0.5 * minFeatureSize;
    const hole: SimplePolygon = [
      [0, d],
      [d, 0],
      [0, -d],
      [-d, 0],
    ];
    for (const gusset of this.gussetsService.gussets) {
      const polygon: SimplePolygon = gusset.hull.map(pt => transformVec2(xyTransform, pt.x, pt.y, 0));
      if (isReverseWinding(xyTransform)) {
        polygon.reverse();
      }
      const hull3d = this.manifoldInstance.extrude([polygon, hole], gusset.halfDepthM * 2);
      const [gx, gy] = transformVec2(xyTransform, gusset.joint.x, gusset.joint.y);
      add(hull3d.translate(gx, gy, 0));
      hull3d.delete();
    }
    return truss;
  }

  public buildAbutment(_xyTransform: Mat2x3, _minFeatureSize: number): Manifold {
    throw new Error('Implement me!');
  }

  public buildPier(_xyTransform: Mat2x3, _minFeatureSize: number): Manifold {
    throw new Error('Implement me!');
  }

  public buildAnchorage(_xyTransform: Mat2x3, _minFeatureSize: number): Manifold {
    throw new Error('Implement me!');
  }

  public buildPillows(_xyTransform: Mat2x3, _minFeatureSize: number): Manifold {
    throw new Error('Implement me!');
  }
}
