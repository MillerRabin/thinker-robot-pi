import { arm } from "../config.js";

export function directMove(ctx) {
  const body = ctx.body;
  return ctx.body;
}

export function move(ctx) {
  const body = ctx.body;
  return ctx.body;
  /*arm.move({
    x: body.x,
    y: body.y,
    z: body.z,
    angleX: body.angleX,
    angleY: body.angleY,
    angleZ: body.angleZ,
    speed: 10,

  })*/
}

export default {
  directAngle,
  move
}