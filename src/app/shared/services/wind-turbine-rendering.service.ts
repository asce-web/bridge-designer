import { Injectable } from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';
import { Mesh, MeshRenderingService } from '../../features/fly-thru/rendering/mesh-rendering.service';
import { UniformService } from '../../features/fly-thru/rendering/uniform.service';
import { WIND_ROTOR_MESH_DATA } from '../../features/fly-thru/models/wind-rotor';
import { WIND_TOWER_MESH_DATA } from '../../features/fly-thru/models/wind-tower';
import { TerrainModelService } from '../../features/fly-thru/models/terrain-model.service';

@Injectable({ providedIn: 'root' })
export class WindTurbineRenderingService {
  private static readonly MILLIS_PER_ROTATION = 3000;
  private readonly towerBasePosition = vec3.fromValues(100, 0, -80);
  private readonly rotorOffset = vec3.fromValues(0, 70, 7);

  private rotorMesh!: Mesh;
  private towerMesh!: Mesh;

  constructor(
    private readonly meshRenderingService: MeshRenderingService,
    private readonly terrainModelService: TerrainModelService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare(): void {
    this.rotorMesh = this.meshRenderingService.prepareColoredMesh(WIND_ROTOR_MESH_DATA);
    this.towerMesh = this.meshRenderingService.prepareColoredMesh(WIND_TOWER_MESH_DATA);
    this.towerBasePosition[1] =
      this.terrainModelService.getElevationAtXZ(this.towerBasePosition[0], this.towerBasePosition[2]) - 0.8;
  }

  public render(viewMatrix: mat4, projectionMatrix: mat4, clockMillis: number) {
    let m = this.uniformService.pushModelMatrix();
    mat4.translate(m, m, this.towerBasePosition);
    this.uniformService.updateTransformsUniform(viewMatrix, projectionMatrix);
    this.meshRenderingService.renderColoredMesh(this.towerMesh);
    mat4.translate(m, m, this.rotorOffset);
    const millisPerRotation = WindTurbineRenderingService.MILLIS_PER_ROTATION;
    mat4.rotateZ(m, m, -2 * Math.PI * (clockMillis % millisPerRotation) / millisPerRotation);
    this.uniformService.updateTransformsUniform(viewMatrix, projectionMatrix);
    this.meshRenderingService.renderColoredMesh(this.rotorMesh);
    this.uniformService.popModelMatrix();
  }
}
