import { paint } from "./paint";

const paintShadow = ctx => {
  ctx.beginPath();
  ctx.arc(50, 50, 50, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fill();
};

export const createPizzaTileSet = (
  tileSize: number,
  n: number
): HTMLCanvasElement => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = tileSize * n;

  if (false) {
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0px";
  }

  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.save();
  ctx.scale(tileSize / 100, tileSize / 100);

  for (let x = n; x--; )
    for (let y = n; y--; ) {
      ctx.save();
      ctx.translate(100 * x + 4, 100 * y + 4);
      ctx.scale(0.92, 0.92);

      ctx.beginPath();
      ctx.rect(0, 0, 100, 100);
      ctx.clip();

      if (x == 0 && y == 0) paintShadow(ctx);
      else paint(ctx);

      ctx.restore();
    }

  return canvas;
};
