import { Injectable } from '@angular/core';
import { GlService } from './gl.service';
import { Utility } from '../../../shared/classes/utility';
import {
  IN_DIRECTION_LOCATION,
  IN_INSTANCE_MODEL_TRANSFORM_LOCATION,
  IN_POSITION_LOCATION,
} from '../shaders/constants';
import { ShaderService } from '../shaders/shader.service';

export type WireData = {
  positions: Float32Array;
  directions: Float32Array;
  indices: Uint16Array;
  // For instanced drawing, one mat4 per instance.
  instanceModelTransforms?: Float32Array;
};

export type Wire = {
  vertexArray: WebGLVertexArrayObject;
  indexBuffer: WebGLBuffer;
  elementCount: number;
  instanceCount?: number;
  positionBuffer: WebGLBuffer;
  directionBuffer: WebGLBuffer;
  instanceModelTransformBuffer?: WebGLBuffer;
};

@Injectable({ providedIn: 'root' })
export class WireRenderingService {
  constructor(
    private readonly glService: GlService,
    private readonly shaderService: ShaderService,
  ) {}

  public prepareWire(wireData: WireData): Wire {
    const gl = this.glService.gl;

    const vertexArray = Utility.assertNotNull(gl.createVertexArray());
    gl.bindVertexArray(vertexArray);

    const positionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, wireData.positions, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_POSITION_LOCATION);
    gl.vertexAttribPointer(IN_POSITION_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const directionBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ARRAY_BUFFER, directionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, wireData.directions!, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(IN_DIRECTION_LOCATION);
    gl.vertexAttribPointer(IN_DIRECTION_LOCATION, 3, gl.FLOAT, false, 0, 0);

    const indexBuffer = Utility.assertNotNull(gl.createBuffer());
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, wireData.indices, gl.STATIC_DRAW);

    let instanceModelTransformBuffer;
    if (wireData.instanceModelTransforms) {
      instanceModelTransformBuffer = Utility.assertNotNull(gl.createBuffer());
      gl.bindBuffer(gl.ARRAY_BUFFER, instanceModelTransformBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, wireData.instanceModelTransforms, gl.STATIC_DRAW);
      // Vertex attributes are limited to 4 floats. This trick sends columns of 4x4. They're
      // assembled magically by the shader.
      for (let i = 0; i < 4; ++i) {
        gl.enableVertexAttribArray(IN_INSTANCE_MODEL_TRANSFORM_LOCATION + i);
        gl.vertexAttribPointer(IN_INSTANCE_MODEL_TRANSFORM_LOCATION + i, 4, gl.FLOAT, false, 64, i * 16);
        gl.vertexAttribDivisor(IN_INSTANCE_MODEL_TRANSFORM_LOCATION + i, 1);
      }
    }
    const elementCount = wireData.indices.length;
    const instanceCount = wireData.instanceModelTransforms ? wireData.instanceModelTransforms.length / 16 : 0;

    return {
      vertexArray,
      positionBuffer,
      directionBuffer,
      indexBuffer,
      elementCount,
      instanceCount,
      instanceModelTransformBuffer,
    };
  }

  public renderWire(wire: Wire) {
    const gl = this.glService.gl;
    gl.useProgram(this.shaderService.getProgram(wire.instanceCount ? 'wire_instances' : 'wire'));
    gl.bindVertexArray(wire.vertexArray);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, wire.indexBuffer);
    if (wire.instanceCount) {
      gl.drawElementsInstanced(gl.LINES, wire.elementCount, gl.UNSIGNED_SHORT, 0, wire.instanceCount);
    } else {
      gl.drawElements(gl.LINES, wire.elementCount, gl.UNSIGNED_SHORT, 0);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindVertexArray(null);
  }

  public deleteExistingWire(wire: Wire | undefined): void {
    if (!wire) {
      return;
    }
    const gl = this.glService.gl;
    gl.deleteVertexArray(wire.vertexArray);
    gl.deleteBuffer(wire.indexBuffer);
    gl.deleteBuffer(wire.directionBuffer);
    gl.deleteBuffer(wire.positionBuffer);
    if (wire.instanceModelTransformBuffer) {
      gl.deleteBuffer(wire.instanceModelTransformBuffer);
    }
  }
}
