/* Copyright (c) 2025-2026 Gene Ressler
   SPDX-License-Identifier: GPL-3.0-or-later */

import { Injectable } from '@angular/core';
import { GlService } from './gl.service';
import { Utility } from '../../../shared/classes/utility';
import { IN_POSITION_LOCATION } from '../shaders/constants';
import { DisplayMatrices, UniformService } from './uniform.service';
import { ShaderService } from '../shaders/shader.service';
import { SKYBOX_TEXTURE_UNIT } from './constants';
import { TextureService } from './texture.service';

/** Container for sky box rendering logic. */
@Injectable({ providedIn: 'root' })
export class SkyRenderingService {
  //   7--------6
  //  /|       /|
  // 4--------5 |
  // | |      | |
  // | 3------|-2
  // |/       |/
  // 0--------1
  // prettier-ignore
  private static readonly POSITIONS = new Float32Array(
    [
      -1, -1, +1, // 0
      +1, -1, +1, // 1
      +1, -1, -1, // 2
      -1, -1, -1, // 3
      -1, +1, +1, // 4
      +1, +1, +1, // 5
      +1, +1, -1, // 6
      -1, +1, -1, // 7
    ]
  );
  // Faces are counter-clockwise from the inside of the cube.
  // prettier-ignore
  private static readonly INDICES = new Uint16Array([
    1, 5, 6, // right
    6, 2, 1,
    3, 7, 4, // left
    4, 0, 3,
    5, 4, 7, // top
    7, 6, 5,
    // Bottom isn't needed:
    // 1, 2, 3, // bottom
    // 3, 0, 1,
    0, 4, 5, // front
    5, 1, 0,
    2, 6, 7, // back
    7, 3, 2,
  ]);

  private indexBuffer!: WebGLBuffer;
  private skyBoxTexture!: WebGLTexture;
  private skyBoxUniformLocation!: WebGLUniformLocation;
  private vertexArray!: WebGLVertexArrayObject;

  constructor(
    private readonly glService: GlService,
    private readonly shaderService: ShaderService,
    private readonly textureService: TextureService,
    private readonly uniformService: UniformService,
  ) {}

  public prepare() {
    const gl = this.glService.gl;
    this.skyBoxTexture = this.textureService.getTexture('skybox');
    const program = this.shaderService.getProgram('sky');
    this.skyBoxUniformLocation = gl.getUniformLocation(program, 'skybox')!;
    this.vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(this.vertexArray);
    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, SkyRenderingService.POSITIONS, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);
    this.indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, SkyRenderingService.INDICES, gl.STATIC_DRAW);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  /** Renders the sky box. Best done last to maximize gain from depth tests. */
  public render(matrices: DisplayMatrices) {
    this.uniformService.updateSkyboxTransformsUniform(matrices.view, matrices.projection);
    const gl = this.glService.gl;
    gl.useProgram(this.shaderService.getProgram('sky'));
    gl.depthFunc(gl.LEQUAL);
    // TODO: Experiment with doing this once, not once per frame. Possible because we have fewer textures than units?
    gl.uniform1i(this.skyBoxUniformLocation, SKYBOX_TEXTURE_UNIT);
    gl.activeTexture(gl.TEXTURE0 + SKYBOX_TEXTURE_UNIT);
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.skyBoxTexture);
    gl.bindVertexArray(this.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, SkyRenderingService.INDICES.length, gl.UNSIGNED_SHORT, 0);
    gl.depthFunc(gl.LESS);
  }
}
