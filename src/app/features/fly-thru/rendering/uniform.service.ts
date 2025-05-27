import { Injectable } from '@angular/core';
import { Utility } from '../../../shared/classes/utility';
import { ShaderService } from '../shaders/shader.service';
import { MATERIAL_CONFIG } from '../models/materials';
import {
  TRANSFORMS_UBO_BINDING_INDEX,
  LIGHT_CONFIG_UBO_BINDING_INDEX,
  MATERIAL_CONFIG_UBO_BINDING_INDEX,
} from '../shaders/constants';
import { mat4 } from 'gl-matrix';

/** std124 padding. */
const _ = 0;

@Injectable({ providedIn: 'root' })
export class UniformService {
  // prettier-ignore
  private static readonly LIGHT_CONFIG = new Float32Array([
    0.0572181596, 0.68661791522, 0.72476335496, // unit light direction
    _,
    0.8, 0.8, 1.0, // light color
    0.08, // ambient intensity
  ]);

  private gl!: WebGL2RenderingContext;
  private transformsBuffer!: WebGLBuffer;
  private readonly transformsStore = new ArrayBuffer(2 * 16 * 4);
  public readonly modelViewMatrix = new Float32Array(this.transformsStore, 0, 16);
  public readonly modelViewProjectionMatrix = new Float32Array(this.transformsStore, 16 * 4, 16);

  constructor(private readonly shaderService: ShaderService) {}

  /** Initializes the service for given canvas context. */
  public initialize(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /** 
   * Does uniform setups that need occur only once per animation. 
   * Currently includes transformations, lighting config, and materials.
   */
  public prepareUniforms(): void {
    const gl = this.gl;
    const program = this.shaderService.getProgram('facet_mesh');

    this.transformsBuffer = this.setUpUniformBlock(program, 'Transforms', TRANSFORMS_UBO_BINDING_INDEX);
    gl.bufferData(gl.UNIFORM_BUFFER, this.transformsStore.byteLength, gl.DYNAMIC_DRAW);

    this.setUpUniformBlock(program, 'LightConfig', LIGHT_CONFIG_UBO_BINDING_INDEX);
    gl.bufferData(gl.UNIFORM_BUFFER, UniformService.LIGHT_CONFIG as Float32Array, gl.STATIC_DRAW);

    this.setUpUniformBlock(program, 'MaterialConfig', MATERIAL_CONFIG_UBO_BINDING_INDEX);
    gl.bufferData(gl.UNIFORM_BUFFER, MATERIAL_CONFIG, gl.STATIC_DRAW);
  }

  public updateTransformsUniform(modelViewMatrix: mat4, projectionMatrix: mat4): void {
    mat4.copy(this.modelViewMatrix, modelViewMatrix);
    mat4.multiply(this.modelViewProjectionMatrix, projectionMatrix, modelViewMatrix);
    const gl = this.gl;
    gl.bindBuffer(gl.UNIFORM_BUFFER, this.transformsBuffer);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.transformsStore);
  }

  private setUpUniformBlock(program: WebGLProgram, name: string, bindingIndex: number): WebGLBuffer {
    const gl = this.gl;
    const blockIndex = gl.getUniformBlockIndex(program, name);
    const buffer = Utility.assertNotNull(gl.createBuffer());
    gl.uniformBlockBinding(program, blockIndex, bindingIndex);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, bindingIndex, buffer);
    return buffer;
  }
}
