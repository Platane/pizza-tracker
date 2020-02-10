// @ts-ignore
import fragmentShaderSource from "./fragment_fs.glsl";
// @ts-ignore
import vertexShaderSource from "./vertex_vs.glsl";

import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniformTexture,
  bindUniform
} from "../../util/shader";
import { mat4 } from "gl-matrix";

const FLOOR_WIDTH = 5;
const FLOOR_LENGTH = 1;
const LABEL_WIDTH = 1.15;
const LABEL_ANGLE = 1;

const vertices: number[] = [];
const faces: number[] = [];
const uvs: number[] = [];

for (let i = 12; i--; ) {
  const m = (1 - LABEL_WIDTH) / 2;

  // prettier-ignore
  vertices.push(
    0.1 + (i + m  )*FLOOR_LENGTH, 0, FLOOR_WIDTH/2 + FLOOR_WIDTH*0.005,
    0.1 + (i + 1-m)*FLOOR_LENGTH, 0, FLOOR_WIDTH/2 + FLOOR_WIDTH*0.005,
    0.1 + (i + 1-m)*FLOOR_LENGTH, 0 - Math.sin(LABEL_ANGLE)*LABEL_WIDTH*FLOOR_LENGTH/3, FLOOR_WIDTH/2 + FLOOR_WIDTH*0.005 + Math.cos(LABEL_ANGLE)*LABEL_WIDTH*FLOOR_LENGTH/3,
    0.1 + (i + m  )*FLOOR_LENGTH, 0 - Math.sin(LABEL_ANGLE)*LABEL_WIDTH*FLOOR_LENGTH/3, FLOOR_WIDTH/2 + FLOOR_WIDTH*0.005 + Math.cos(LABEL_ANGLE)*LABEL_WIDTH*FLOOR_LENGTH/3,
  )

  // prettier-ignore
  faces.push(
    i*4+1, i*4+2, i*4+3,
    i*4+3, i*4+1, i*4+0,
  )

  // prettier-ignore
  uvs.push(
    0 , i/12,
    1 , i/12 ,
    1 , (i+1)/12 -0.004,
    0 , (i+1)/12 -0.004,
  )
}

const monthLabel_texture = document.createElement("canvas");
// document.body.appendChild(monthLabel_texture);
// monthLabel_texture.style.position = "fixed";
// monthLabel_texture.style.top = "0px";

{
  const h = 512 / 12;
  monthLabel_texture.width = h * 3;
  monthLabel_texture.height = h * 12;
  const ctx = monthLabel_texture.getContext("2d") as CanvasRenderingContext2D;

  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.textBaseline = "middle";
  ctx.textAlign = "center";
  ctx.font = `${Math.floor(h * 0.9)}px helvetica`;

  for (let i = 0; i < 12; i++) {
    const literalMonth = new Date(`2017/${i + 1}/10`).toString().slice(4, 7);

    // ctx.beginPath()
    // ctx.lineWidth = 2
    // ctx.strokeRect(0,h*i,h*3,h)

    ctx.beginPath();
    ctx.fillText(literalMonth, h * 1.5, h * (i + 0.5 - 0.12), h * 3);
  }
}

export const create = (gl: WebGLRenderingContext) => {
  // Create the shader program
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Declare the vertex attribute
  const attribute_position = bindAttribute(gl, program, "aVertexPosition", 3);
  const attribute_uv = bindAttribute(gl, program, "aVertexUV", 2);
  const elementIndex = bindElementIndex(gl, program);
  const uniform_worldMatrix = bindUniform(gl, program, "uWorldMatrix", "mat4");
  const sampler_monthLabel = bindUniformTexture(gl, program, "uSampler");

  sampler_monthLabel.update(monthLabel_texture);
  attribute_position.update(vertices);
  attribute_uv.update(uvs);
  elementIndex.update(faces);

  const n_faces = faces.length;

  return {
    draw: (projectionMatrix: mat4) => {
      gl.useProgram(program);

      uniform_worldMatrix.update(projectionMatrix);

      uniform_worldMatrix.bind();
      elementIndex.bind();
      attribute_uv.bind();
      attribute_position.bind();
      sampler_monthLabel.bind();

      gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0);
    }
  };
};
