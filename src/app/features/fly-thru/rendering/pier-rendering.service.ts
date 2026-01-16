/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { PierModelService } from '../models/pier-model.service';
import { Mesh, MeshRenderingService } from './mesh-rendering.service';
import { DisplayMatrices, UniformService } from './uniform.service';
import { mat4, vec3 } from 'gl-matrix';
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
    this.pierMesh = this.meshRenderingService.prepareTexturedMesh(texturedMeshData, 'img/bricktile.png');
    this.pillowMesh = this.meshRenderingService.prepareColoredMesh(coloredMeshData);
    const pierJoint = this.bridgeService.bridge.joints[this.bridgeService.designConditions.pierJointIndex];
    vec3.set(this.offset, pierJoint.x, pierJoint.y, 0);
  }

  public render(matrices: DisplayMatrices): void {
    if (!this.bridgeService.designConditions.isPier) {
      return;
    }
    let m = this.uniformService.pushModelMatrix();
    mat4.translate(m, m, this.offset);
    this.uniformService.updateTransformsUniform(matrices);
    this.meshRenderingService.renderTexturedMesh(this.pierMesh);
    this.meshRenderingService.renderColoredMesh(this.pillowMesh);
    this.uniformService.popModelMatrix();
  }
}
