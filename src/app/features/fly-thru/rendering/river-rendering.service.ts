import { Injectable } from '@angular/core';
import { mat4, vec3 } from 'gl-matrix';
import { DisplayMatrices, UniformService } from './uniform.service';
import { Mesh, MeshRenderingService } from './mesh-rendering.service';
import { RIVER_MESH_DATA } from '../models/river';
import { BridgeService } from '../../../shared/services/bridge.service';
import { TerrainModelService } from '../models/terrain-model.service';
import { SiteConstants } from '../../../shared/classes/site-constants';

/** Container for the singleton river mesh and rendering context. */
@Injectable({ providedIn: 'root' })
export class RiverRenderingService {
  private readonly offset = vec3.create();
  private surfaceMesh!: Mesh;

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly meshRenderingService: MeshRenderingService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare(): void {
    this.surfaceMesh = this.meshRenderingService.prepareRiverMesh(RIVER_MESH_DATA);
  }

  public render(matrices: DisplayMatrices): void {
    let m: mat4 = this.uniformService.pushModelMatrix();
    // Account for origin x at left joint and y at bridge deck level.
    // TODO: Could listen for bridge loads and compute these only then.
    const x0 = 0.5 * this.bridgeService.designConditions.spanLength;
    const y0 =
      TerrainModelService.WATER_LEVEL + SiteConstants.GAP_DEPTH - this.bridgeService.designConditions.deckElevation;
    mat4.translate(m, m, vec3.set(this.offset, x0, y0, 0));
    this.uniformService.updateTransformsUniform(matrices);
    this.meshRenderingService.renderRiverMesh(this.surfaceMesh);
    this.uniformService.popModelMatrix();
  }
}
