
import Router from ('koa-router');
import { koaBody } from "koa-body";
import armControl from "../arm/control.js";

const router = new Router();

router.get('/directAngle', koaBody(), armControl.contect.directAngle);
router.get('/move', koaBody(), armControl.contect.move);

module.exports = router;