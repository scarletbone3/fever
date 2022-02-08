const http = require('http');
const combine = require('./combine-functions');

module.exports = class Application {

    constructor() {
        this.middleware = [];
    }

    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be a function!');
        this.middleware.push(fn);
    }

    listen(...args) {
        return http.createServer(this.#handle()).listen(...args);
    }

    #handle() {
        const fns = combine(this.middleware);
        return (req, res) => {
            const ctx = { req, res };
            fns(ctx)
                .then(() => this.#finishResponse(ctx))
                .catch((e) => {
                    ctx.status = 500;
                    ctx.contentType = 'text/plain';
                    ctx.body = e.messsage;
                    this.#finishResponse(ctx);
                });
        };
    }

    #finishResponse(ctx) {
        const { res, status = 200, contentType = 'application/json', body = '' } = ctx;
        res.writeHead(status, { 'Content-type': contentType });
        res.end(contentType === 'application/json' ? JSON.stringify(body) : body);
    }

};
