module.exports = (ctx, next) => new Promise(resolve => {
    let buffer = '';
    ctx.req.on('data', chunk => buffer += chunk);
    ctx.req.on('end', () => {
        try {
            ctx.req.body = JSON.parse(buffer);
        } catch (e) {
            ctx.req.body = {};
        }
        resolve();
    });
}).then(() => next());
