import { vec3, vec2 } from "gl-matrix";

const LINE_TICKNESS = 0.03;
const LINE_SEGMENT = 6;

const z = vec3.set(vec3.create(), 0, 0, 1);
const u = vec3.create();
const ap = vec2.create();
const pb = vec2.create();

const circle = Array.from({ length: LINE_SEGMENT }).map((_, k, arr) =>
  vec2.set(
    vec2.create(),
    Math.sin((k / arr.length) * Math.PI * 2),
    Math.cos((k / arr.length) * Math.PI * 2)
  )
);

export const computeLine = (line: Array<vec2>) => {
  const vertices: Array<number> = [];
  const faces: Array<number> = [];
  const normals: Array<number> = [];

  line.forEach((p, i) => {
    // draw a circle around the intersection
    // the cercle is in the plan M
    // the vector z(0,0,1) is in this plane
    // the vector u ( to be determined ) is also

    if (i == 0) {
      vec2.sub(pb, line[i + 1], p);
      if (pb[0] > 0) vec3.set(u, -pb[1], pb[0], 0);
      else vec3.set(u, pb[1], -pb[0], 0);
    } else if (i == line.length - 1) {
      vec2.sub(ap, line[i - 1], p);
      if (ap[0] > 0) vec3.set(u, -ap[1], ap[0], 0);
      else vec3.set(u, ap[1], -ap[0], 0);
    } else {
      vec2.sub(ap, line[i - 1], p);
      vec2.sub(pb, line[i + 1], p);

      vec2.normalize(ap, ap);
      vec2.normalize(pb, pb);

      {
        const c = ap[0];
        if (c > 0) {
          ap[0] = -ap[1];
          ap[1] = c;
        } else {
          ap[0] = ap[1];
          ap[1] = -c;
        }
      }

      {
        const c = pb[0];
        if (c > 0) {
          pb[0] = -pb[1];
          pb[1] = c;
        } else {
          pb[0] = pb[1];
          pb[1] = -c;
        }
      }

      vec3.set(u, (pb[0] + ap[0]) / 2, (pb[1] + ap[1]) / 2, 0);
    }

    vec3.normalize(u, u);

    vertices.push(
      ...circle
        .map(r => [
          p[0] + (u[0] * r[0] + z[0] * r[1]) * LINE_TICKNESS,
          p[1] + (u[1] * r[0] + z[1] * r[1]) * LINE_TICKNESS,
          0 + (u[2] * r[0] + z[2] * r[1]) * LINE_TICKNESS
        ])
        .flat()
    );

    normals.push(
      ...circle
        .map(r => [
          u[0] * r[0] + z[0] * r[1],
          u[1] * r[0] + z[1] * r[1],
          u[2] * r[0] + z[2] * r[1]
        ])
        .flat()
    );

    if (i > 0)
      for (let k = LINE_SEGMENT; k--; )
        faces.push(
          (i - 0) * LINE_SEGMENT + ((k + 1) % LINE_SEGMENT),
          (i - 0) * LINE_SEGMENT + ((k + 2) % LINE_SEGMENT),
          (i - 1) * LINE_SEGMENT + ((k + 2) % LINE_SEGMENT),

          (i - 0) * LINE_SEGMENT + ((k + 1) % LINE_SEGMENT),
          (i - 1) * LINE_SEGMENT + ((k + 2) % LINE_SEGMENT),
          (i - 1) * LINE_SEGMENT + ((k + 1) % LINE_SEGMENT)
        );
  });

  return { vertices, faces, normals };
};
