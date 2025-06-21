import { Injectable } from '@angular/core';
import { Utility } from '../../../shared/classes/utility';
import { IN_POSITION_LOCATION, IN_NORMAL_LOCATION, IN_MATERIAL_REF_LOCATION } from '../shaders/constants';
import { ShaderService } from '../shaders/shader.service';
import { GlService } from './gl.service';
import { ImageService } from '../../../shared/core/image.service';
import { Colors } from '../../../shared/classes/graphics';

export type Mesh = {
  vertexArray: WebGLVertexArrayObject;
  texture?: WebGLTexture;
  textureUniformLocation?: WebGLUniformLocation;
  indexBuffer: WebGLBuffer;
  elementCount: number;
  // For delete-able meshes.
  positionBuffer?: WebGLBuffer;
  normalBuffer?: WebGLBuffer;
  texCoordBuffer?: WebGLBuffer;
};

export type MeshData = {
  positions: Float32Array;
  normals?: Float32Array;
  texCoords?: Float32Array;
  materialRefs?: Uint16Array;
  indices: Uint16Array;
};

/** Container for the WebGL details of rendering meshes: one-time preparation and per-frame drawing. */
@Injectable({ providedIn: 'root' })
export class MeshRenderingService {
  constructor(
    private readonly glService: GlService,
    private readonly imageService: ImageService,
    private readonly shaderService: ShaderService,
  ) {}

  /** Prepares a static colored-facet mesh for drawing. */
  public prepareColoredFacetMesh(meshData: MeshData): Mesh {
    const gl = this.glService.gl;

    const vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(vertexArray);

    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshData.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const normalBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshData.normals!, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_NORMAL_LOCATION);
    gl.vertexAttribPointer(IN_NORMAL_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const materialRefBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, materialRefBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshData.materialRefs!, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_MATERIAL_REF_LOCATION);
    gl.vertexAttribIPointer(IN_MATERIAL_REF_LOCATION, 1, gl.UNSIGNED_SHORT, 2, 0);

    const indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshData.indices, gl.STATIC_DRAW);

    const elementCount = meshData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    return { vertexArray, indexBuffer, elementCount };
  }

  /** Renders a previously prepared facet mesh.  */
  public renderFacetMesh(mesh: Mesh) {
    const gl = this.glService.gl;
    gl.useProgram(this.shaderService.getProgram('facet_mesh'));
    gl.bindVertexArray(mesh.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  public prepareTerrainMesh(meshData: MeshData): Mesh {
    const gl = this.glService.gl;

    const vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(vertexArray);

    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshData.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const normalBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshData.normals!, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_NORMAL_LOCATION);
    gl.vertexAttribPointer(IN_NORMAL_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshData.indices, gl.STATIC_DRAW);

    const elementCount = meshData.indices.length;

    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);

    return { vertexArray, indexBuffer, elementCount, positionBuffer, normalBuffer };
  }

  /** Renders a previously prepared terrain mesh.  */
  public renderTerrainMesh(mesh: Mesh) {
    const gl = this.glService.gl;
    gl.useProgram(this.shaderService.getProgram('terrain'));
    gl.bindVertexArray(mesh.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  public prepareRiverMesh(meshData: MeshData): Mesh {
    const gl = this.glService.gl;

    const vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(vertexArray);

    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, meshData.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    // Note x-z coordinates only. y=0 is assumed.
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 2, gl.FLOAT, false, 0, 0);

    const indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshData.indices, gl.STATIC_DRAW);

    const texture = Utility.assertNotNull(gl.createTexture());
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Use a solid color texture of 1 pixel until the water image loads.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, Colors.GL_WATER);
    const waterUrl = 'img/water.jpg';
    this.imageService.createImagesLoader([waterUrl]).invokeAfterLoaded(imagesByUrl => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imagesByUrl[waterUrl]);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    const program = this.shaderService.getProgram('river');
    const textureUniformLocation = gl.getUniformLocation(program, 'water')!;

    const elementCount = meshData.indices.length;

    return { vertexArray, indexBuffer, elementCount, texture, textureUniformLocation };
  }

  /** Renders the already prepared river mesh. */
  public renderRiverMesh(mesh: Mesh) {
    const gl = this.glService.gl;
    gl.useProgram(this.shaderService.getProgram('river'));
    const textureUnit = 1;
    gl.uniform1i(Utility.assertNotUndefined(mesh.textureUniformLocation), textureUnit);
    gl.activeTexture(gl.TEXTURE0 + textureUnit);
    gl.bindTexture(gl.TEXTURE_2D, Utility.assertNotUndefined(mesh.texture));
    gl.bindVertexArray(mesh.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
    gl.drawElements(gl.TRIANGLES, mesh.elementCount, gl.UNSIGNED_SHORT, 0);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  public deleteExistingMesh(mesh: Mesh | undefined): void {
    if (!mesh) {
      return;
    }
    const gl = this.glService.gl;
    gl.deleteVertexArray(mesh.vertexArray);
    gl.deleteBuffer(mesh.indexBuffer);
    if (mesh.normalBuffer) {
      gl.deleteBuffer(mesh.normalBuffer);
    }
    if (mesh.texCoordBuffer) {
      gl.deleteBuffer(mesh.texCoordBuffer);
    }
    if (mesh.positionBuffer) {
      gl.deleteBuffer(mesh.positionBuffer);
    }
  }
}
