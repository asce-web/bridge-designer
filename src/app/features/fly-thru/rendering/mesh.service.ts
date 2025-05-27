import { Injectable } from '@angular/core';
import { Utility } from '../../../shared/classes/utility';
import { IN_POSITION_LOCATION, IN_NORMAL_LOCATION, IN_MATERIAL_REF_LOCATION } from '../shaders/constants';
import { ShaderService } from '../shaders/shader.service';

export type Mesh = {
  positionBuffer: WebGLBuffer;
  normalBuffer: WebGLBuffer;
  materialRefBuffer: WebGLBuffer;
  indexBuffer: WebGLBuffer;
  vertexArray: WebGLVertexArrayObject;
  elementCount: number;
};

@Injectable({ providedIn: 'root' })
export class MeshService {
  private gl!: WebGL2RenderingContext;

  constructor(private readonly shaderService: ShaderService) {}

  public initialize(gl: WebGL2RenderingContext) {
    this.gl = gl;
  }

  /** Prepares a static color facet mesh for drawing. */
  public prepareFacetMesh(
    positions: Float32Array,
    normals: Float32Array,
    materialRefs: Uint16Array,
    indices: Uint16Array,
  ): Mesh {
    const gl = this.gl;

    const vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(vertexArray);

    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const normalBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_NORMAL_LOCATION);
    gl.vertexAttribPointer(IN_NORMAL_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const materialRefBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, materialRefBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, materialRefs, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_MATERIAL_REF_LOCATION);
    gl.vertexAttribIPointer(IN_MATERIAL_REF_LOCATION, 1, gl.UNSIGNED_SHORT, 2, 0);

    const indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

    const elementCount = indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    return { positionBuffer, normalBuffer, materialRefBuffer, indexBuffer, vertexArray, elementCount };
  }

  public renderFacetMesh(mesh: Mesh) {
    const gl = this.gl;
    gl.useProgram(this.shaderService.getProgram('facet_mesh'));
    gl.bindVertexArray(mesh.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }
}
