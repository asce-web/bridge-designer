import { Injectable } from '@angular/core';
import { mat4 } from 'gl-matrix';
import { ShaderService } from '../shaders/shader.service';
import { ViewService } from './view.service';
import { ProjectionService } from './projection.service';

@Injectable({ providedIn: 'root' })
export class RendererService {
  private readonly viewMatrix = mat4.create();
  private readonly projectionMatrix = mat4.create();
  private _gl!: WebGL2RenderingContext;

  constructor(
    private readonly shaderService: ShaderService,
    private readonly viewService: ViewService,
    private readonly projectionService: ProjectionService,
  ) {}

  public set gl(value: WebGL2RenderingContext) {
    this._gl = value;
  }

  /** Set the rendered view to default. Includes movement limits for the eye. */
  public setDefaultView(): void {
    this.viewService.setFixedViewLimits();
    this.viewService.resetView();
  }

  public setViewport(width: number, height: number) {
    this._gl.viewport(0, 0, width, height);
  }

  public renderFrame(_clockMillis: number, _elapsedMillis: number): void {
    // TODO: Maybe call this getter once in initialize().
    this.projectionService.getPerspectiveProjection(this.projectionMatrix);
    this.viewService.getLookAtMatrix(this.viewMatrix);
    this.shaderService.compileShaders(this._gl);

    // TODO: Remove after sky box is implemented.
    const gl = this._gl;
    gl.clearColor(0.5294, 0.8078, 0.9216, 1); // sky blue
    gl.clearDepth(1);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
}
