// @ts-ignore
import fragmentShaderSource from "./fragment_fs.glsl";
// @ts-ignore
import vertexShaderSource from "./vertex_vs.glsl";

import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform
} from "../../util/shader";
import { mat4 } from "gl-matrix";

const FLOOR_WIDTH = 5;
const FLOOR_LENGTH = 1;

const vertices: number[] = [];
const faces: number[] = [];

for (let i = 6; i--; ) {
  // prettier-ignore
  vertices.push(
    0.1 + (i*2+0)*FLOOR_LENGTH, 0,  FLOOR_WIDTH/2,
    0.1 + (i*2+1)*FLOOR_LENGTH, 0,  FLOOR_WIDTH/2,
    0.1 + (i*2+1)*FLOOR_LENGTH, 0, -FLOOR_WIDTH/2,
    0.1 + (i*2+0)*FLOOR_LENGTH, 0, -FLOOR_WIDTH/2,
  )

  // prettier-ignore
  faces.push(
    i*4+1, i*4+2, i*4+3,
    i*4+3, i*4+1, i*4+0,
  )
}

export const create = (gl: WebGLRenderingContext) => {
  // Create the shader program
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Declare the vertex attribute
  const attribute_position = bindAttribute(gl, program, "aVertexPosition", 3);
  const elementIndex = bindElementIndex(gl, program);
  const uniform_worldMatrix = bindUniform(gl, program, "uWorldMatrix", "mat4");

  attribute_position.update(vertices);
  elementIndex.update(faces);

  const n_faces = faces.length;

  return {
    update: () => 0,

    draw: (projectionMatrix: mat4) => {
      gl.useProgram(program);

      uniform_worldMatrix.update(projectionMatrix);

      uniform_worldMatrix.bind();
      elementIndex.bind();
      attribute_position.bind();

      gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0);
    }
  };
};
