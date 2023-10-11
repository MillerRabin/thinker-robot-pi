import koa from 'koa';
import http from 'http';
import router from "./routes.js";
import response from "./middlewares/response.js";
import responseTime from "./middlewares/responseTime.js";

const application = new koa();

application.use(responseTime.koa);
application.use(response.koa);

application.use(router.routes());

function createServer(application, port) {
  return new Promise((resolve, reject) => {
    const server = http.createServer(application.callback());
    server.listen(port, (err) => {
      if (err != null) return reject(err);
      console.log("Server accepts connections at " + port);
      return resolve();
    });
  });
}

export async function start(port) {
  return await createServer(application, port);
}

export default {
  start
}