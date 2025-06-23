import { Injectable } from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';
import { WireData } from '../rendering/wire-rendering.service';
import { TerrainModelService } from './terrain-model.service';
import { Geometry } from '../../../shared/classes/graphics';

@Injectable({ providedIn: 'root' })
export class UtilityLineModelService {
  private static readonly X_WEST_TOWER = -116;
  private static readonly Z_WEST_TOWER = -102;
  private static readonly DX_TOWER = 90;
  private static readonly DZ_TOWER = 70;
  //private static readonly dTower = vectorLength(
  //  UtilityLineModelService.dxTower,
  //  UtilityLineModelService.dzTower,
  //);
  //private static readonly xUnitPerpTower = -UtilityLineRenderingService.dzTower / UtilityLineRenderingService.dTower;
  //private static readonly zUnitPerpTower = UtilityLineRenderingService.dxTower / UtilityLineRenderingService.dTower;
  private static readonly THETA_TOWER = -Math.atan2(UtilityLineModelService.DZ_TOWER, UtilityLineModelService.DX_TOWER);
  private static readonly TOWER_COUNT = 4;
  private static readonly WIRE_POST_COUNT_PER_TOWER = 20;
  //private static readonly dxWire =
  //  UtilityLineRenderingService.dxTower / UtilityLineRenderingService.wirePostCountPerTower;
  //private static readonly dzWire =
  //  UtilityLineRenderingService.dzTower / UtilityLineRenderingService.wirePostCountPerTower;
  private static readonly DROOP_SLOPE = -1 / 10;
  //private static readonly wireColor = [0.6, 0.3, 0.3, 1.0];
  // prettier-ignore
  public static readonly wireOffsets = [
    -2.48, 10.9,           0, 0,
    -2.48, 10.9 + 1.5,     0, 0,
    -2.48, 10.9 + 1.5 * 2, 0, 0,
     2.48, 10.9,           0, 0,
     2.48, 10.9 + 1.5,     0, 0,
     2.48, 10.9 + 1.5 * 2, 0, 0,
  ];

  private readonly offset = vec3.create();

  constructor(private readonly terrainModelService: TerrainModelService) {}

  /** Fill model data structures for the current terrain model. */
  public buildModel(): [Float32Array, WireData] {
    const transforms = UtilityLineModelService.createTowerModelTransforms();
    const wireData = UtilityLineModelService.createWireData();
    const positions = wireData.positions;
    const directions = wireData.directions;
    const indices = wireData.indices;
    let x0, y0, z0, ip, ii;
    ip = ii = 0;
    for (
      let iTower = 0, transformOffset = 0;
      iTower < UtilityLineModelService.TOWER_COUNT;
      ++iTower, transformOffset += 16
    ) {
      // Instance transformations
      const x1 = UtilityLineModelService.X_WEST_TOWER + iTower * UtilityLineModelService.DX_TOWER;
      const z1 = UtilityLineModelService.Z_WEST_TOWER + iTower * UtilityLineModelService.DZ_TOWER;
      // Make bottom just below surface elevation to avoid gaps on steep terrain.
      const y1 = this.terrainModelService.getElevationAtXZ(x1, z1) - 0.2;
      const m = transforms.subarray(transformOffset, transformOffset + 16);
      mat4.identity(m);
      mat4.translate(m, m, vec3.set(this.offset, x1, y1, z1));
      mat4.rotateY(m, m, UtilityLineModelService.THETA_TOWER);

      // Power wire between tower pairs. Coordinates are wrt bottom center of tower.
      // Translated per-instance to the ends of support arms.
      if (iTower) {
        const dx = x1 - x0!;
        const dy = y1 - y0!;
        const dz = z1 - z0!;
        const du = Geometry.vectorLength2D(dx, dz);
        const m = dy / du + UtilityLineModelService.DROOP_SLOPE;
        const a = (dy - m * du) / (du * du);
        // d0 is the previous segment direction, and d1 is the current wrt iWire.
        // So iWire=0 has no previous, and iWire=post count has no current.
        let dx0, dy0, dz0, dx1, dy1, dz1;
        for (let iWire = 0; iWire <= UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER; iWire++) {
          // Positions.
          const t = iWire / UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER;
          const u = du * t;
          positions[ip] = x0! + dx * t;
          positions[ip + 1] = y0! + (a * u + m) * u;
          positions[ip + 2] = z0! + dz * t;
          // Directions.
          if (iWire < UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER) {
            dx1 = positions[ip + 3] - positions[ip];
            dy1 = positions[ip + 4] - positions[ip + 1];
            dz1 = positions[ip + 5] - positions[ip + 2];
            const s = 1.0 / Math.sqrt(dx1 * dx1 + dy1 * dy1 + dz1 * dz1);
            dx1 *= s;
            dy1 *= s;
            dz1 *= s;
          } else {
            dx1 = dy1 = dz1 = undefined;
          }
          // Ends get direction if resp wire segment. Middle posts get average of two.
          let n = 0,
            dirX = 0,
            dirY = 0,
            dirZ = 0;
          if (dx0 !== undefined) {
            dirX += dx0!;
            dirY += dy0!;
            dirZ += dz0!;
            ++n;
          }
          if (dx1 !== undefined) {
            dirX += dx1!;
            dirY += dy1!;
            dirZ += dz1!;
            ++n;
          }
          if (n === 2) {
            const s = 1.0 / Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
            dirX *= s;
            dirY *= s;
            dirZ *= s;
          }
          directions[ip] = dirX;
          directions[ip + 1] = dirY;
          directions[ip + 2] = dirZ;
          dx0 = dx1;
          dy0 = dy1;
          dz0 = dz1;
          ip += 3;
        }
      }
      x0 = x1;
      y0 = y1;
      z0 = z1;
    }
    // Each wire section between towers has countPerTower+1 vertices. Each wire segment gets two indices.
    for (let iTower = 1; iTower < UtilityLineModelService.TOWER_COUNT; ++iTower) {
      for (let iWire = 0; iWire < UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER; iWire++) {
        const segStartVertexIndex = iTower * (UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER + 1) + iWire;
        indices[ii++] = segStartVertexIndex;
        indices[ii++] = segStartVertexIndex + 1;
      }
    }
    /* TODO: Build matrices that translate by the offset.
    gl.glColor3fv(wireColor, 0);
    for (int iOffset = 0; iOffset < wireOffsets.length; ++iOffset) {
        float xOfs = xUnitPerpTower * wireOffsets[iOffset].x();
        float yOfs = wireOffsets[iOffset].y();
        float zOfs = zUnitPerpTower * wireOffsets[iOffset].x();
        gl.glBegin(GL2.GL_LINE_STRIP);
        for (int iTower = 0; iTower < wirePt.length; ++iTower) {
            for (int iWire = (iTower == 0) ? 0 : 1; iWire < wirePt[0].length; ++iWire) {
                Homogeneous.Point p = wirePt[iTower][iWire];
                gl.glVertex3f(p.x() + xOfs, p.y() + yOfs, p.z() + zOfs);
            }
        }
        gl.glEnd();
    }
    */
    return [transforms, wireData];
  }

  private static createTowerModelTransforms(): Float32Array {
    return new Float32Array(16 * UtilityLineModelService.TOWER_COUNT);
  }

  private static createWireData(): WireData {
    const positionCount =
      (UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER + 1) * (UtilityLineModelService.TOWER_COUNT - 1);
    const lineCount = UtilityLineModelService.WIRE_POST_COUNT_PER_TOWER * (UtilityLineModelService.TOWER_COUNT - 1);
    return {
      positions: new Float32Array(positionCount * 3),
      directions: new Float32Array(positionCount * 3),
      indices: new Uint16Array(lineCount * 2),
    };
  }
}
