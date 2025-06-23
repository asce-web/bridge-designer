import { Injectable } from '@angular/core';
import { TOWER_MESH_DATA } from '../models/tower';
import { Mesh, MeshRenderingService } from './mesh-rendering.service';
import { mat4 } from 'gl-matrix';
import { UniformService } from './uniform.service';
import { UtilityLineModelService } from '../models/utility-line-model.service';
import { Wire, WireRenderingService } from './wire-rendering.service';

@Injectable({ providedIn: 'root' })
export class UtilityLineRenderingService {
  private towerMesh!: Mesh;
  private lineWireInstances!: Wire;

  constructor(
    private readonly meshRenderingService: MeshRenderingService,
    private readonly uniformService: UniformService,
    private readonly utilityLineModelService: UtilityLineModelService,
    private readonly wireRenderingService: WireRenderingService,
  ) {}

  public prepare(): void {
    // TODO: Remove this restriction so we can rebuild the terrain model.
    if (this.towerMesh) {
      throw new Error('Only one prepare() allowed');
    }
    const [instanceModelTransforms, wireData] = this.utilityLineModelService.buildModel();
    const meshData = { instanceModelTransforms, ...TOWER_MESH_DATA };
    this.towerMesh = this.meshRenderingService.prepareColoredFacetMesh(meshData);
    this.lineWireInstances = this.wireRenderingService.prepareWire(wireData);
  }

  public render(viewMatrix: mat4, projectionMatrix: mat4) {
    this.uniformService.updateTransformsUniform(viewMatrix, projectionMatrix);
    this.meshRenderingService.renderFacetMesh(this.towerMesh);
    this.wireRenderingService.renderWire(this.lineWireInstances);
  }
}
