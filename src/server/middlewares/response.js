export async function koa(ctx, next) {
    try {
        let data = await next();
        if ((data != null) && (ctx.body == null))
            ctx.body = data;
    } catch (err) {
        console.log(err);
        if (err instanceof exports.Error) {
            ctx.status = 400;
            ctx.body = err;
            return;
        }

        let data = getOracleError(err, null);
        if (data != null) {
            ctx.status = 400;
            ctx.body = data;
            return;
        }

        ctx.status = err.statusCode || err.status || 500;
        ctx.body = {
            text: err.message
        }
    }
}

export default {
    koa
}