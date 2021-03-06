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

const LABEL_TEXT_HEIGHT = 512 / 8;
const LABEL_HEIGHT = 0.4;
const LINE_WIDTH = 0.03;

const vertices: number[] = [];
const faces: number[] = [];
const uvs: number[] = [];

const updateGeometry = (values: { v: number; y: number }[], k: number) => {
  vertices.length = 0;
  faces.length = 0;
  uvs.length = 0;

  const h = LABEL_TEXT_HEIGHT;

  const w = 1 << Math.ceil(Math.log((values.length + 1) * h) / Math.LN2);

  const n = w / h;

  // const x_offset = Math.max( k*0.8 - 2, 0 )
  const x_offset = k + LABEL_HEIGHT;

  values.forEach(({ y }, i) => {
    // prettier-ignore
    vertices.push(
      x_offset -LABEL_HEIGHT*2 , y              , i-0.2,
      x_offset                 , y              , i-0.2,
      x_offset                 , y+LABEL_HEIGHT , i-0.2,
      x_offset -LABEL_HEIGHT*2 , y+LABEL_HEIGHT , i-0.2,

      x_offset -LABEL_HEIGHT - LINE_WIDTH/2, 0             , i-0.2,
      x_offset -LABEL_HEIGHT + LINE_WIDTH/2, 0             , i-0.2,
      x_offset -LABEL_HEIGHT + LINE_WIDTH/2, Math.max(0,y) , i-0.2,
      x_offset -LABEL_HEIGHT - LINE_WIDTH/2, Math.max(0,y) , i-0.2,

      0, 0.01, i-LINE_WIDTH,
      k, 0.01, i-LINE_WIDTH,
      k, 0.01, i+LINE_WIDTH,
      0, 0.01, i+LINE_WIDTH,
    )

    // prettier-ignore
    faces.push(
      i*12+1, i*12+2, i*12+3,
      i*12+3, i*12+1, i*12+0,

      i*12+5, i*12+6, i*12+7,
      i*12+7, i*12+5, i*12+4,

      i*12+9, i*12+10, i*12+11,
      i*12+11, i*12+9, i*12+8,
    )

    // prettier-ignore
    uvs.push(
      0 , (i+2)/n,
      1 , (i+2)/n,
      1 , (i+1)/n,
      0 , (i+1)/n,

      0.25 , (0.5)/n,
      0.25 , (0.5)/n,
      0.25 , (0.5)/n,
      0.25 , (0.5)/n,

      0.75 , (0.5)/n,
      0.75 , (0.5)/n,
      0.75 , (0.5)/n,
      0.75 , (0.5)/n,
    )
  });

  return { vertices, uvs, faces };
};

const label_texture = document.createElement("canvas");
// document.body.appendChild(label_texture);
// label_texture.style.position = "fixed";
// label_texture.style.top = "0px";

const updateTexture = (values: Array<{ v: number; y: number }>) => {
  const h = LABEL_TEXT_HEIGHT;

  const w = 1 << Math.ceil(Math.log((values.length + 1) * h) / Math.LN2);

  const n = w / h;

  label_texture.width = h * 2;
  label_texture.height = h * n;
  const ctx = label_texture.getContext("2d") as CanvasRenderingContext2D;

  ctx.clearRect(0, 0, h, h * n);
  ctx.fillStyle = "rgba(255,255,255,1)";

  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.beginPath();
  ctx.rect(h, 0, h, h * 0.9);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,1)";
  ctx.beginPath();
  ctx.rect(0, 0, h, h * 0.9);
  ctx.fill();

  values.forEach(({ v }, i) => {
    const a = "" + Math.floor(v);
    const b = "." + ((v % 1) + "0".repeat(10)).slice(2, 4);

    ctx.textBaseline = "bottom";
    ctx.textAlign = "right";

    ctx.beginPath();
    ctx.font = `${Math.floor(h * 0.8)}px helvetica`;
    ctx.fillText(a, h * 1.06, h * (2 + i), h);

    ctx.beginPath();
    ctx.font = `${Math.floor(h * 0.6)}px helvetica`;
    ctx.fillText(b, h * 1.9, h * (2 + i - 0.025), h);
  });

  return label_texture;
};

export const create = (gl: WebGLRenderingContext) => {
  // Create the shader program
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Declare the vertex attribute
  const attribute_position = bindAttribute(gl, program, "aVertexPosition", 3);
  const attribute_uv = bindAttribute(gl, program, "aVertexUV", 2);
  const elementIndex = bindElementIndex(gl, program);
  const uniform_worldMatrix = bindUniform(gl, program, "uWorldMatrix", "mat4");
  const sampler_label = bindUniformTexture(gl, program, "uSampler");

  let n_faces = 0;

  return {
    setValues: (values: Array<{ v: number; y: number }>, k: number) => {
      const { uvs, faces, vertices } = updateGeometry(values, k);
      attribute_uv.update(uvs);
      elementIndex.update(faces);
      attribute_position.update(vertices);
      sampler_label.update(updateTexture(values));
      n_faces = faces.length;
    },

    draw: (projectionMatrix: mat4) => {
      gl.useProgram(program);

      uniform_worldMatrix.update(projectionMatrix);

      uniform_worldMatrix.bind();
      elementIndex.bind();
      attribute_uv.bind();
      attribute_position.bind();
      sampler_label.bind();

      gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0);
    }
  };
};
