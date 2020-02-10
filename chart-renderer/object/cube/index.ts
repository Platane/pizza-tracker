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
import { vec3, mat4 } from "gl-matrix";

// prettier-ignore
const vertices      = [
    0,0,0,
    1,0,0,
    0,1,0,

    0,0,0,
    0,1,0,
    0,0,1,

    0,0,0,
    0,0,1,
    1,0,0,
]

// prettier-ignore
const faces         = [
    0,1,2,
    3,4,5,
    6,7,8,
]

// prettier-ignore
const colors         = [
    1,0,0,1,
    1,0,0,1,
    1,0,0,1,

    0,1,0,1,
    0,1,0,1,
    0,1,0,1,

    0,0,1,1,
    0,0,1,1,
    0,0,1,1,
]

export const create = (gl: WebGLRenderingContext) => {
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  const attribute_position = bindAttribute(gl, program, "aVertexPosition", 3);
  const attribute_color = bindAttribute(gl, program, "aVertexColor", 4);
  const elementIndex = bindElementIndex(gl, program);
  const uniform_worldMatrix = bindUniform(gl, program, "uWorldMatrix", "mat4");

  attribute_position.update(vertices);
  attribute_color.update(colors);
  elementIndex.update(faces);

  const n_faces = faces.length;

  return {
    setPosition: (pos: vec3) => {
      const v = vertices.map((x, i) => x * 0.2 + pos[i % 3]);

      attribute_position.update(v);
    },

    draw: (projectionMatrix: mat4) => {
      gl.useProgram(program);

      uniform_worldMatrix.update(projectionMatrix);

      uniform_worldMatrix.bind();
      elementIndex.bind();
      attribute_color.bind();
      attribute_position.bind();

      gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0);
    }
  };
};
