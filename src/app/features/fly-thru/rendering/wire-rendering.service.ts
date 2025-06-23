import { Injectable } from '@angular/core';

export type WireData = {
  positions: Float32Array;
  directions: Float32Array;
  indices: Uint16Array;
};

export type Wire = {
  vertexArray: WebGLVertexArrayObject;
  indexBuffer: WebGLBuffer;
  elementCount: number;
  instanceCount?: number;
  // For delete-able meshes.
  positionBuffer?: WebGLBuffer;
  directionBuffer?: WebGLBuffer;
};

@Injectable({ providedIn: 'root' })
export class WireRenderingService {
  constructor() {}
}
