import { Injectable } from '@angular/core';
import { TOWER_MESH_DATA } from '../models/tower';
import { Mesh, MeshRenderingService } from './mesh-rendering.service';
import { mat4, vec3 } from 'gl-matrix';
import { UniformService } from './uniform.service';
import { TerrainModelService } from '../models/terrain-model.service';

@Injectable({ providedIn: 'root' })
export class UtilityLineRenderingService {
  private static readonly X_WEST_TOWER = -116;
  private static readonly Z_WEST_TOWER = -102;
  private static readonly DX_TOWER = 90;
  private static readonly DZ_TOWER = 70;
  //private static readonly dTower = vectorLength(
  //  UtilityLineRenderingService.dxTower,
  //  UtilityLineRenderingService.dzTower,
  //);
  //private static readonly xUnitPerpTower = -UtilityLineRenderingService.dzTower / UtilityLineRenderingService.dTower;
  //private static readonly zUnitPerpTower = UtilityLineRenderingService.dxTower / UtilityLineRenderingService.dTower;
  private static readonly thetaTower = -Math.atan2(
    UtilityLineRenderingService.DZ_TOWER,
    UtilityLineRenderingService.DX_TOWER,
  );
  private static readonly TOWER_COUNT = 4;
  //private static readonly wirePostCountPerTower = 20;
  //private static readonly dxWire =
  //  UtilityLineRenderingService.dxTower / UtilityLineRenderingService.wirePostCountPerTower;
  //private static readonly dzWire =
  //  UtilityLineRenderingService.dzTower / UtilityLineRenderingService.wirePostCountPerTower;
  //private static readonly droopSlope = -1 / 10;
  //private static readonly wireColor = [0.6, 0.3, 0.3, 1.0];

  private readonly offset = vec3.create();
  private towerMesh!: Mesh;

  constructor(
    private readonly meshRenderingService: MeshRenderingService,
    private readonly terrainModelService: TerrainModelService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare(): void {
    const instanceModelTransforms = this.buildTowerModelTransforms();
    const meshData = { instanceModelTransforms, ...TOWER_MESH_DATA };
    this.towerMesh = this.meshRenderingService.prepareColoredFacetMesh(meshData);
    this.buildWireMeshData();
  }

  public render(viewMatrix: mat4, projectionMatrix: mat4) {
    this.uniformService.updateTransformsUniform(viewMatrix, projectionMatrix);
    this.meshRenderingService.renderFacetMesh(this.towerMesh);
  }

  /** Builds a model transformation for each tower to rotate and position it.  */
  private buildTowerModelTransforms(): Float32Array {
    const towerCount = UtilityLineRenderingService.TOWER_COUNT;
    const transforms = new Float32Array(16 * towerCount);
    for (let i = 0, offset = 0; i < towerCount; ++i, offset += 16) {
      const x = UtilityLineRenderingService.X_WEST_TOWER + i * UtilityLineRenderingService.DX_TOWER;
      const z = UtilityLineRenderingService.Z_WEST_TOWER + i * UtilityLineRenderingService.DZ_TOWER;
      // Make bottom just below surface elevation to avoid gaps on steep terrain.
      const y = this.terrainModelService.getElevationAtXZ(x, z) - 0.2; 
      const m = transforms.subarray(offset, offset + 16);
      mat4.identity(m);
      mat4.translate(m, m, vec3.set(this.offset, x, y, z));
      mat4.rotateY(m, m, UtilityLineRenderingService.thetaTower);
    }
    return transforms;
  }

  private buildWireMeshData(): LineMeshData {
    return {positions: new Float32Array(), directions: new Float32Array(), indices: new Uint16Array() };
  }
}

type LineMeshData = {
  positions: Float32Array;
  directions: Float32Array;
  indices: Uint16Array;
}

  /* 

    protected static final Homogeneous.Point [] wireOffsets = {
        new Homogeneous.Point(-2.48f, 10.9f,            0f, 0f),
        new Homogeneous.Point(-2.48f, 10.9f + 1.5f,     0f, 0f),
        new Homogeneous.Point(-2.48f, 10.9f + 1.5f * 2, 0f, 0f),
        new Homogeneous.Point( 2.48f, 10.9f,            0f, 0f),
        new Homogeneous.Point( 2.48f, 10.9f + 1.5f,     0f, 0f),
        new Homogeneous.Point( 2.48f, 10.9f + 1.5f * 2, 0f, 0f),
    };

    protected final Homogeneous.Point towerPt [] = new Homogeneous.Point [towerCount];
    protected final Homogeneous.Point wirePt [] [] = new Homogeneous.Point [towerCount - 1] [wirePostCountPerTower + 1];

    /**
     * Initialize the power lines data structures.  Completely re-implemented 29 November 2011 for
     * legacy graphics.
     
    private void initializePowerLines() {
        for (int iTower = 0; iTower < towerCount; iTower++) {
            float xTower = xWestTower + iTower * dxTower;
            float zTower = zWestTower + iTower * dzTower;
            // Place towers slightly below ground so they don't float over irregular terrain.
            towerPt[iTower] = new Homogeneous.Point(xTower, getElevationAt(xTower, zTower) - 0.5f, zTower);
            if (iTower > 0) {
                Homogeneous.Point p0 = towerPt[iTower - 1], p1 = towerPt[iTower];
                float dx = p1.x() - p0.x();
                float dy = p1.y() - p0.y();
                float dz = p1.z() - p0.z();
                float du = (float)Math.sqrt(dx * dx + dz * dz);
                float m = dy / du + droopSlope;
                float a = (dy - m * du) / (du * du);
                for (int iWire = 0; iWire <= wirePostCountPerTower; iWire++) {
                    float t = (float)iWire / wirePostCountPerTower;
                    float u = du * t;
                    wirePt[iTower - 1][iWire] = new Homogeneous.Point(
                            p0.x() + dx * t,
                            p0.y() + (a * u + m) * u,
                            p0.z() + dz * t);
                }
            }
        }
    }
    */

    /*
function vectorLength(dx: number, dy: number): number {
  return Math.sqrt(dx * dx + dy * dy);
}
*/
