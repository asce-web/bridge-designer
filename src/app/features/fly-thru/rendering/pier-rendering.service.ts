import { Injectable } from '@angular/core';
import { PierModelService } from '../models/pier-model.service';
import { Mesh, MeshRenderingService } from './mesh-rendering.service';
import { UniformService } from './uniform.service';
import { mat4, vec3 } from 'gl-matrix';
import { Colors } from '../../../shared/classes/graphics';
import { BridgeService } from '../../../shared/services/bridge.service';

@Injectable({ providedIn: 'root' })
export class PierRenderingService {
  private pierMesh!: Mesh;
  private pillowMesh!: Mesh;
  private readonly offset = vec3.create();

  constructor(
    private readonly bridgeService: BridgeService,
    private readonly pierModelService: PierModelService,
    private readonly meshRenderingService: MeshRenderingService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare(): void {
    if (!this.bridgeService.designConditions.isPier) {
      return;
    }
    // Delete previously prepared meshes.
    this.meshRenderingService.deleteExistingMesh(this.pierMesh);
    this.meshRenderingService.deleteExistingMesh(this.pillowMesh);

    // Build new ones.
    const { texturedMeshData, coloredMeshData } = this.pierModelService.buildMeshDataForPier();
    // TODO: Cache textures as optimization. We use this one twice.
    const url = 'img/bricktile.png';
    this.pierMesh = this.meshRenderingService.prepareTexturedMesh(texturedMeshData, url, Colors.GL_CONCRETE);
    this.pillowMesh = this.meshRenderingService.prepareColoredMesh(coloredMeshData);
    const pierJoint = this.bridgeService.bridge.joints[this.bridgeService.designConditions.pierJointIndex];
    vec3.set(this.offset, pierJoint.x, pierJoint.y, 0);
  }

  public render(viewMatrix: mat4, projectionMatrix: mat4): void {
    if (!this.bridgeService.designConditions.isPier) {
      return;
    }
    let m = this.uniformService.pushModelMatrix()
    mat4.translate(m, m, this.offset);
    this.uniformService.updateTransformsUniform(viewMatrix, projectionMatrix);
    this.meshRenderingService.renderTexturedMesh(this.pierMesh);
    this.meshRenderingService.renderColoredMesh(this.pillowMesh);
    this.uniformService.popModelMatrix();
  }
}
