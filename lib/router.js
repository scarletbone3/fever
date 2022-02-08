const combine = require('./combine-functions');

module.exports = class Router {

    constructor() {
        this.routes = {};
        for (const method of ['get', 'post', 'put', 'delete']) {
            this[method] = (path, ...middleware) => {
                const fns = combine(middleware);
                if (this.routes[path] && this.routes[path][method]) 
                    throw new TypeError(`Router [${path}]:[${method}] already exists`);
                this.routes[path] = {};
                this.routes[path][method] = fns;
            };
        }
    }

    getRoutes() {
        return (ctx, next) => {
            const { path, method } = ctx;
            if (!this.routes[path]) {
                ctx.body = { message: 'Not found' };
                ctx.status = 404;
                return Promise.resolve();
            }
            if (!this.routes[path][method]) {
                ctx.body = { message: 'Method not supported' };
                ctx.status = 405;
                return Promise.resolve();
            }
            return this.routes[path][method](ctx, next);
        };
    }

};
