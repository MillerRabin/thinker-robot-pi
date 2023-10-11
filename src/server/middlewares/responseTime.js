import { responseWarningTime } from '../../config.js';

export async function koa(ctx, next) {
  const start = new Date();
  const data = await next();
  if (ctx.request.req.method == 'OPTIONS') return;
  const ms = new Date() - start;
  ctx.response.set('request-time', ms);
  if (ms >= responseWarningTime)
    console.log(`${ctx.method} ${ctx.url} - ${ms} ms`);
  return data;
};

export default {
  koa
}
