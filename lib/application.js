const http = require('http');
const combine = require('./combine-functions');

/**
 * Expose 'Application' class
 */

class Application {

    /**
     * Initialize a new 'Application'
     * 
     * @api public
     */

    constructor() {
        this.middleware = [];
    }

    /**
     * Use the given middleware 'fn'
     * 
     * @param {Function} fn
     * @api public
     */

    use(fn) {
        if (typeof fn !== 'function') throw new TypeError('Middleware must be a function!');
        this.middleware.push(fn);
    }

    /**
     * 
     * Creating an http sever
     * 
     * @param  {...any} args 
     * @returns {Server}
     * @api public
     */

    listen(...args) {
        return http.createServer(this.#handle()).listen(...args);
    }

    /**
     * 
     * Request processing
     * 
     * @api private
     */

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

    /**
     * 
     * Response
     * 
     * @param {*} ctx 
     */

    #finishResponse(ctx) {
        const { res, status = 200, contentType = 'application/json', body = '' } = ctx;
        res.writeHead(status, { 'Content-type': contentType });
        res.end(contentType === 'application/json' ? JSON.stringify(body) : body);
    }

}

module.exports = Application;
