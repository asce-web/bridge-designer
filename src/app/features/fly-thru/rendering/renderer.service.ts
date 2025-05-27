import { Injectable } from '@angular/core';
import { mat4 } from 'gl-matrix';
import { ShaderService } from '../shaders/shader.service';
import { ViewService } from './view.service';
import { ProjectionService } from './projection.service';
import { TRUCK_INDICES, TRUCK_MATERIALS_REFS, TRUCK_NORMALS, TRUCK_POSITIONS } from '../models/truck';
import { UniformService } from './uniform.service';
import { Mesh, MeshService } from './mesh.service';
import { TOWER_INDICES, TOWER_MATERIALS_REFS, TOWER_NORMALS, TOWER_POSITIONS } from '../models/tower';

@Injectable({ providedIn: 'root' })
export class RendererService {
  private readonly viewMatrix = mat4.create();
  private readonly projectionMatrix = mat4.create();
  private gl!: WebGL2RenderingContext;
  private truckMesh!: Mesh;
  private towerMesh!: Mesh;

  constructor(
    private readonly meshService: MeshService,
    private readonly projectionService: ProjectionService,
    private readonly shaderService: ShaderService,
    private readonly uniformService: UniformService,
    private readonly viewService: ViewService,
  ) {}

  public initialize(gl: WebGL2RenderingContext): void {
    this.meshService.initialize(gl);
    this.shaderService.initialize(gl);
    this.uniformService.initialize(gl);
    this.gl = gl;
  }

  /** Sets the rendered view to default. Includes movement limits for the eye. */
  public setDefaultView(): void {
    this.viewService.setFixedViewLimits();
    this.viewService.resetView();
  }

  /* Sets the viewport in window coordinates including projection aspect ratio. */
  public setViewport(x: number, y: number, width: number, height: number) {
    if (width <= 0 || height <= 0) {
      return;
    }
    this.gl.viewport(x, y, width, height);
    // Experimentally determined view.
    this.projectionService.set(45, width / height, 0.333333, 400, 0.5);
  }

  /** Set up for rendering frames. */
  public prepareToRender(): void {
    this.uniformService.prepareUniforms();
    //TODO: Have the builder wrap these in an object.
    this.truckMesh = this.meshService.prepareFacetMesh(
      TRUCK_POSITIONS,
      TRUCK_NORMALS,
      TRUCK_MATERIALS_REFS,
      TRUCK_INDICES,
    );
    this.towerMesh = this.meshService.prepareFacetMesh(
      TOWER_POSITIONS,
      TOWER_NORMALS,
      TOWER_MATERIALS_REFS,
      TOWER_INDICES,
    );
  }

  public renderFrame(_clockMillis: number, _elapsedMillis: number): void {
    if (!this.gl) {
      return;
    }
    // TODO: Maybe call this getter once in setViewport;
    this.projectionService.getPerspectiveProjection(this.projectionMatrix);
    this.viewService.getLookAtMatrix(this.viewMatrix);

    const gl = this.gl;

    // TODO: Remove after sky box is implemented.
    gl.clearColor(0.5294, 0.8078, 0.9216, 1); // sky blue
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // TODO: Incorporate model matrix here.
    this.uniformService.updateTransformsUniform(this.viewMatrix, this.projectionMatrix);

    this.meshService.renderFacetMesh(this.truckMesh);
    this.meshService.renderFacetMesh(this.towerMesh);
  }
}
