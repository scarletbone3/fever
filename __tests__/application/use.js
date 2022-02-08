const request = require('supertest');
const assert = require('assert');

const { Fever } = require('../../index');

describe('Use', () => {
    it('should combine middleware', async () => {
        const fever = new Fever();
        const calls = [];

        fever.use((ctx, next) => {
            calls.push(1);
            return next().then(() => {
                calls.push(6);
            });
        });

        fever.use((ctx, next) => {
            calls.push(2);
            return next().then(() => {
                calls.push(5);
            });
        });

        fever.use((ctx, next) => {
            calls.push(3);
            return next().then(() => {
                calls.push(4);
            });
        });

        const server = fever.listen();

        await request(server)
            .get('/')
            .expect(200);

        assert.deepStrictEqual(calls, [1, 2, 3, 4, 5, 6]);
    });

    it('should combine mixed middleware', async () => {
        const fever = new Fever();
        const calls = [];

        fever.use((ctx, next) => {
            calls.push(1);
            return next().then(() => {
                calls.push(6);
            });
        });

        fever.use(async (ctx, next) => {
            calls.push(2);
            await next();
            calls.push(5);
        });

        fever.use((ctx, next) => {
            calls.push(3);
            return next().then(() => {
                calls.push(4);
            });
        });

        const server = fever.listen();

        await request(server)
            .get('/')
            .expect(200);

        assert.deepStrictEqual(calls, [1, 2, 3, 4, 5, 6]);
    });
    
    it('should handle use error', () => {
        const fever = new Fever();
        
        [null, undefined, 0, false, 'not a function'].forEach(fn => {
            assert.throws(() => fever.use(fn), TypeError);
        });
    });
});