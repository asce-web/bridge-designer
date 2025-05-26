import { Injectable } from '@angular/core';
import { mat4 } from 'gl-matrix';
import { Programs, ProgramSpec, ShaderService } from '../shaders/shader.service';
import { ViewService } from './view.service';
import { ProjectionService } from './projection.service';
import { ToastError } from '../../toast/toast/toast-error';
import { TOWER_INDICES, TOWER_MATERIALS_REFS, TOWER_NORMALS, TOWER_POSITIONS } from '../models/tower';
import { MATERIAL_CONFIG } from '../models/materials';
import {
  IN_MATERIAL_REF_LOCATION,
  IN_NORMAL_LOCATION,
  IN_POSITION_LOCATION,
  LIGHT_CONFIG_UBO_BINDING_INDEX,
  MATERIAL_CONFIG_UBO_BINDING_INDEX,
  TRANSFORMS_UBO_BINDING_INDEX,
} from '../shaders/constants';
import { Utility } from '../../../shared/classes/utility';

const _ = 0;

@Injectable({ providedIn: 'root' })
export class RendererService {
  // prettier-ignore
  private static readonly LIGHT_CONFIG = new Float32Array([
    0.0572181596, 0.68661791522, 0.72476335496, // unit light direction
    _,
    0.8, 0.8, 1.0, // light color
    0.08, // ambient intensity
  ]);
  private readonly viewMatrix = mat4.create();
  private readonly projectionMatrix = mat4.create();
  private _gl!: WebGL2RenderingContext;
  private programs: Programs | undefined;
  private vertexArray!: WebGLVertexArrayObject;
  private transformsBuffer!: WebGLBuffer;
  private readonly transformsStore = new ArrayBuffer(2 * 16 * 4);
  private readonly modelViewMatrix = new Float32Array(this.transformsStore, 0, 16);
  private readonly modelViewProjectionMatrix = new Float32Array(this.transformsStore, 16 * 4, 16);
  private indexBuffer!: WebGLBuffer;

  constructor(
    private readonly shaderService: ShaderService,
    private readonly viewService: ViewService,
    private readonly projectionService: ProjectionService,
  ) {}

  public initialize(gl: WebGL2RenderingContext): void {
    this._gl = gl;
    const shaders = this.shaderService.compileShaders(gl);
    const programSpecs: ProgramSpec[] = [
      {
        name: 'facet_mesh',
        vertexShader: shaders['FACET_MESH_VERTEX_SHADER'],
        fragmentShader: shaders['FACET_MESH_FRAGMENT_SHADER'],
      },
    ];
    this.programs = this.shaderService.linkPrograms(this._gl, programSpecs);
    if (!this.programs) {
      throw new ToastError('needWebGl2Error');
    }
  }

  /** Set the rendered view to default. Includes movement limits for the eye. */
  public setDefaultView(): void {
    this.viewService.setFixedViewLimits();
    this.viewService.resetView();
  }

  public setViewport(x: number, y: number, width: number, height: number) {
    if (width === 0 || height === 0) {
      return;
    }
    this._gl.viewport(x, y, width, height);
    // Experimentally determined view.
    this.projectionService.set(45, width / height, 1 / 3, 400, 0.5);
  }

  /** Set up for rendering frames. */
  public prepareToRender() {
    if (!this.programs) {
      return;
    }
    // TODO: Move to tower renderer service.
    const gl = this._gl;
    this.vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(this.vertexArray);

    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, TOWER_POSITIONS, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const normalBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, TOWER_NORMALS, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_NORMAL_LOCATION);
    gl.vertexAttribPointer(IN_NORMAL_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const materialRefBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, materialRefBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, TOWER_MATERIALS_REFS, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_MATERIAL_REF_LOCATION);
    gl.vertexAttribIPointer(IN_MATERIAL_REF_LOCATION, 1, gl.UNSIGNED_SHORT, 2, 0);

    this.indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, TOWER_INDICES, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    const program = this.programs['facet_mesh'];

    this.transformsBuffer = this.setUpUniformBlock(program, 'Transforms', TRANSFORMS_UBO_BINDING_INDEX);
    gl.bufferData(gl.UNIFORM_BUFFER, this.transformsStore.byteLength, gl.DYNAMIC_DRAW);

    this.setUpUniformBlock(program, 'LightConfig', LIGHT_CONFIG_UBO_BINDING_INDEX);
    gl.bufferData(gl.UNIFORM_BUFFER, RendererService.LIGHT_CONFIG as Float32Array, gl.STATIC_DRAW);

    this.setUpUniformBlock(program, 'MaterialConfig', MATERIAL_CONFIG_UBO_BINDING_INDEX);
    gl.bufferData(gl.UNIFORM_BUFFER, MATERIAL_CONFIG, gl.STATIC_DRAW);
  }

  private setUpUniformBlock(program: WebGLProgram, name: string, bindingIndex: number): WebGLBuffer {
    const gl = this._gl;
    const blockIndex = gl.getUniformBlockIndex(program, name);
    const buffer = Utility.assertNotNull(gl.createBuffer());
    gl.uniformBlockBinding(program, blockIndex, bindingIndex);
    gl.bindBufferBase(gl.UNIFORM_BUFFER, bindingIndex, buffer);
    return buffer;
  }

  public renderFrame(_clockMillis: number, _elapsedMillis: number): void {
    if (!this.programs) {
      return;
    }
    // TODO: Maybe call this getter once in initialize().
    this.projectionService.getPerspectiveProjection(this.projectionMatrix);
    this.viewService.getLookAtMatrix(this.viewMatrix);

    // TODO: Incorporate model matrix here.
    mat4.copy(this.modelViewMatrix, this.viewMatrix);
    mat4.multiply(this.modelViewProjectionMatrix, this.projectionMatrix, this.viewMatrix);

    const gl = this._gl;

    // TODO: Remove after sky box is implemented.
    gl.clearColor(0.5294, 0.8078, 0.9216, 1); // sky blue
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.programs['facet_mesh']);

    gl.bindBuffer(gl.UNIFORM_BUFFER, this.transformsBuffer);
    gl.bufferSubData(gl.UNIFORM_BUFFER, 0, this.transformsStore);

    gl.bindVertexArray(this.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.drawElements(gl.TRIANGLES, TOWER_INDICES.length, gl.UNSIGNED_SHORT, 0);
  }
}
