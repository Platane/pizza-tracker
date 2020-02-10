// @ts-ignore
import fragmentShaderSource from "./fragment_fs.glsl";
// @ts-ignore
import vertexShaderSource from "./vertex_vs.glsl";
import { vec2, mat4 } from "gl-matrix";
import { computeLine } from "./geometry";

import {
  createProgram,
  bindAttribute,
  bindElementIndex,
  bindUniform
} from "../../util/shader";

type Line = {
  color: [number, number, number, number];
  dashStart: number;
  points: { x: number; y: number }[];
  values: { x: number; y: number }[];
};

export const create = (gl: WebGLRenderingContext) => {
  // Create the shader program
  const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);

  // Declare the vertex attribute
  const attribute_normal = bindAttribute(gl, program, "aVertexNormal", 3);
  const attribute_position = bindAttribute(gl, program, "aVertexPosition", 3);
  const attribute_color = bindAttribute(gl, program, "aVertexColor", 4);
  const attribute_length = bindAttribute(gl, program, "aVertexLength", 1);
  const attribute_dash = bindAttribute(gl, program, "aVertexDash", 1);

  const elementIndex = bindElementIndex(gl, program);

  const uniform_worldMatrix = bindUniform(gl, program, "uWorldMatrix", "mat4");
  const uniform_k = bindUniform(gl, program, "uk", "float");

  let n_faces = 0;

  return {
    setK: (k: number) => {
      uniform_k.update(k);
    },

    setLines: (lines: Line[]) => {
      const vertices: number[] = [];
      const normals: number[] = [];
      const colors: number[] = [];
      const faces: number[] = [];
      const length: number[] = [];
      const dash: number[] = [];

      lines.forEach(({ points: points_, dashStart, color }, i, arr) => {
        const points = points_.map(p => vec2.fromValues(p.x, p.y));

        const offset = vertices.length / 3;

        // push length info
        // ( useful to display dashed line )
        {
          let l = 0;
          points.forEach((_, k) => {
            if (k > 0) l = l + vec2.distance(points[k], points[k - 1]);

            for (let u = 6; u--; ) length.push(l);
          });
        }

        {
          points.forEach(p => {
            const v = p[0] > dashStart ? 1 : 0;

            for (let u = 6; u--; ) dash.push(v);
          });
        }

        // compute the mesh geometry
        const res = computeLine(points);

        const tz = i;

        vertices.push(...res.vertices.map((x, u) => (u % 3 == 2 ? x + tz : x)));
        normals.push(...res.normals);
        faces.push(...res.faces.map(i => offset + i));
        colors.push(
          ...Array.from({ length: res.vertices.length / 3 })
            .map(() => color)
            .flat()
        );
      });

      elementIndex.update(faces);

      attribute_position.update(vertices);
      attribute_normal.update(normals);
      attribute_length.update(length);
      attribute_dash.update(dash);
      attribute_color.update(colors);

      n_faces = faces.length;
    },

    draw: (projectionMatrix: mat4) => {
      gl.useProgram(program);

      uniform_worldMatrix.update(projectionMatrix);

      elementIndex.bind();
      attribute_position.bind();
      attribute_normal.bind();
      attribute_color.bind();
      attribute_length.bind();
      attribute_dash.bind();
      uniform_worldMatrix.bind();
      uniform_k.bind();

      gl.drawElements(gl.TRIANGLES, n_faces, gl.UNSIGNED_SHORT, 0);
    }
  };
};
