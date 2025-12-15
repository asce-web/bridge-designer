/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { AbutmentModelService } from '../models/abutment-model.service';
import { Mesh, MeshRenderingService } from './mesh-rendering.service';
import { DisplayMatrices, UniformService } from './uniform.service';
import { Colors } from '../../../shared/classes/graphics';

@Injectable({ providedIn: 'root' })
export class AbutmentRenderingService {
  private abutmentMesh!: Mesh;
  private pillowMesh!: Mesh;

  constructor(
    private readonly abutmentModelService: AbutmentModelService,
    private readonly meshRenderingService: MeshRenderingService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare(): void {
    // Delete previously prepared meshes.
    this.meshRenderingService.deleteExistingMesh(this.abutmentMesh);
    this.meshRenderingService.deleteExistingMesh(this.pillowMesh);

    // Build new ones.
    const { texturedMeshData, coloredMeshData } = this.abutmentModelService.buildAbutment();
    const url = 'img/bricktile.png';
    this.abutmentMesh = this.meshRenderingService.prepareTexturedMesh(texturedMeshData, url, Colors.GL_CONCRETE);
    this.pillowMesh = this.meshRenderingService.prepareColoredMesh(coloredMeshData);
  }

  public render(matrices: DisplayMatrices): void {
    this.uniformService.updateTransformsUniform(matrices);
    this.meshRenderingService.renderTexturedMesh(this.abutmentMesh);
    this.meshRenderingService.renderColoredMesh(this.pillowMesh);
  }
}
