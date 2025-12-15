/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { UTILITY_TOWER_MESH_DATA } from '../models/utility-tower';
import { Mesh, MeshRenderingService, Wire } from './mesh-rendering.service';
import { DisplayMatrices, UniformService } from './uniform.service';
import { UtilityLineModelService } from '../models/utility-line-model.service';

@Injectable({ providedIn: 'root' })
export class UtilityLineRenderingService {
  private towerMesh!: Mesh;
  private lineWireInstances!: Wire;

  constructor(
    private readonly meshRenderingService: MeshRenderingService,
    private readonly uniformService: UniformService,
    private readonly utilityLineModelService: UtilityLineModelService,
  ) {}

  public prepare(): void {
    this.meshRenderingService.deleteExistingMesh(this.towerMesh);
    this.meshRenderingService.deleteExistingWire(this.lineWireInstances);
    const [instanceModelTransforms, wireData] = this.utilityLineModelService.buildModel();
    const meshData = { instanceModelTransforms, ...UTILITY_TOWER_MESH_DATA };
    this.towerMesh = this.meshRenderingService.prepareColoredMesh(meshData);
    this.lineWireInstances = this.meshRenderingService.prepareWire(wireData);
  }

  public render(matrices: DisplayMatrices) {
    this.uniformService.updateTransformsUniform(matrices);
    this.meshRenderingService.renderColoredMesh(this.towerMesh);
    this.meshRenderingService.renderWire(this.lineWireInstances);
  }
}
