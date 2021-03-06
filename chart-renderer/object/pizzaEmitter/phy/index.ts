import { vec3 } from "gl-matrix";

const n = 4;
const uvTable = Array.from({ length: n * n }).map((_, i) =>
  // prettier-ignore
  [
    ((i%n)    )/n, ( (0|(i/n))    )/n,
    ((i%n) +1 )/n, ( (0|(i/n))    )/n,
    ((i%n) +1 )/n, ( (0|(i/n)) +1 )/n,
    ((i%n)    )/n, ( (0|(i/n)) +1 )/n,
  ]
);

type Entity = {
  p: vec3;
  v: vec3;
  size: number;
  age: number;
  n: number;
};

const INERTIA = 0.986;
const MAX_ENTITY = 400;
const MAX_AGE = 300;

const entityPool: Array<Entity> = [];

const create = (): Entity =>
  entityPool.shift() || {
    age: 0,
    size: 0,
    n: 0,
    p: vec3.create(),
    v: vec3.create()
  };

const prepare = (entity: Entity, p: vec3, v0: vec3, v0Noise: vec3): Entity => {
  entity.p = vec3.copy(entity.p, p);
  entity.v = vec3.set(
    entity.v,
    v0[0] + (Math.random() - 0.5) * v0Noise[0],
    v0[1] + (Math.random() - 0.5) * v0Noise[1],
    v0[2] + (Math.random() - 0.5) * v0Noise[2]
  );
  entity.size = Math.random() * 0.06 + 0.06;
  entity.age = Math.floor(Math.random() * 50);
  entity.n = Math.floor(Math.random() * (uvTable.length - 1) + 1);

  return entity;
};

export const createWorld = () => {
  const entities: Array<Entity> = [];

  const opacities: number[] = [];
  const vertices: number[] = [];
  const faces: number[] = [];
  const uv: number[] = [];

  const a = vec3.create();

  return {
    step: (delta: number) => {
      for (let i = entities.length; i--; ) {
        const e = entities[i];

        if (e.age++ > MAX_AGE) entityPool.push(entities.splice(i, 1)[0]);
        else {
          vec3.set(a, 0, -3, 0);

          vec3.lerp(e.v, a, e.v, INERTIA);

          vec3.scaleAndAdd(e.p, e.p, e.v, delta / 1000);

          // ground collision
          if (
            e.p[1] <
            e.size * 0.9
            // &&
            // Math.abs(e.p[2]) < 2.5
            // &&
            // Math.floor(e.p[0])%2 == 0
          ) {
            e.p[1] = e.size * 0.9;
            e.v[1] = -e.v[1] * 0.8;

            if (e.v[1] < 0.01) e.v[1] = 0;
          }
        }
      }
    },

    spawn: (p: vec3, v0: vec3, v0Noise: vec3): void => {
      if (entities.length < MAX_ENTITY)
        entities.push(prepare(create(), p, v0, v0Noise));
    },

    getGeometry: () => {
      opacities.length = 0;
      vertices.length = 0;
      faces.length = 0;
      uv.length = 0;

      entities.forEach(({ size, n, p, v, age }, i) => {
        const fade = 0.05;
        const o =
          1 - Math.max(0, (age - MAX_AGE * (1 - fade)) / (MAX_AGE * fade));

        opacities.push(o, o, o, o);

        const sk = 1 - Math.min(p[1], 2) / 2;
        const os = o * sk;

        opacities.push(os, os, os, os);

        // prettier-ignore
        vertices.push(
          p[0]-size, p[1]-size, p[2],
          p[0]+size, p[1]-size, p[2],
          p[0]+size, p[1]+size, p[2],
          p[0]-size, p[1]+size, p[2],

          p[0]-size*sk, 0.001*i, p[2]-size*sk,
          p[0]+size*sk, 0.001*i, p[2]-size*sk,
          p[0]+size*sk, 0.001*i, p[2]+size*sk,
          p[0]-size*sk, 0.001*i, p[2]+size*sk,
        )

        // prettier-ignore
        faces.push(
          i*8+0, i*8+1, i*8+2,
          i*8+3, i*8+0, i*8+2,

          i*8+4, i*8+5, i*8+6,
          i*8+7, i*8+4, i*8+6,
        )

        uv.push(...uvTable[n], ...uvTable[0]);
      });

      return {
        opacities,
        vertices,
        faces,
        uv
      };
    }
  };
};
