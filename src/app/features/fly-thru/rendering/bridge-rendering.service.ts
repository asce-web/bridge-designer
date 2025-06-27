import { Injectable } from '@angular/core';
import { mat4 } from 'gl-matrix';
import { Mesh, MeshRenderingService, Wire } from './mesh-rendering.service';
import { BridgeModelService } from '../models/bridge-model.service';
import { UniformService } from './uniform.service';
import { BridgeGussetsModelService } from '../models/bridge-gussets-model.service';

@Injectable({ providedIn: 'root' })
export class BridgeRenderingService {
  private membersMesh!: Mesh;
  private stiffeningWire!: Wire;
  private gussetMeshes!: Mesh[];

  constructor(
    private readonly bridgeGussetsModelService: BridgeGussetsModelService,
    private readonly bridgeModelService: BridgeModelService,
    private readonly meshRenderingService: MeshRenderingService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare(): void {
    this.meshRenderingService.deleteExistingMesh(this.membersMesh);
    const bridgeMeshData = this.bridgeModelService.buildForCurrentAnalysis();
    this.membersMesh = this.meshRenderingService.prepareColoredMesh(bridgeMeshData.memberMeshData);
    this.stiffeningWire = this.meshRenderingService.prepareWire(bridgeMeshData.stiffeningWireData);
    const gussetMeshData = this.bridgeGussetsModelService.meshData;
    this.gussetMeshes = gussetMeshData.map(meshData => this.meshRenderingService.prepareColoredMesh(meshData));
  }

  public render(viewMatrix: mat4, projectionMatrix: mat4): void {
    this.uniformService.updateTransformsUniform(viewMatrix, projectionMatrix);
    this.meshRenderingService.renderColoredMesh(this.membersMesh);
    this.meshRenderingService.renderWire(this.stiffeningWire);
    this.gussetMeshes.forEach(mesh => this.meshRenderingService.renderColoredMesh(mesh));
  }
}
