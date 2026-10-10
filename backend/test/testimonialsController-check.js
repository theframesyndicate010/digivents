const assert = require('node:assert/strict');
const test = require('node:test');
const { reset, destroy } = require('./helpers/testDb');
const testimonialsController = require('../src/controllers/testimonialsController');

test.beforeEach(reset);
test.after(destroy);

function mockRes() {
    return {
        statusCode: null,
        body: null,
        status(code) { this.statusCode = code; return this; },
        json(payload) { this.body = payload; return this; }
    };
}

// Mirrors express's next(): returns undefined so the promise chain settles.
const run = async (handler, req) => {
    const res = mockRes();
    let forwarded = null;
    await handler(req, res, (error) => { forwarded = error; });
    return { res, forwarded };
};

test('getTestimonials responds 200 with a data array', async () => {
    const { res, forwarded } = await run(testimonialsController.getTestimonials, {});

    assert.equal(forwarded, null);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
    assert.equal(Array.isArray(res.body.data), true);
});

test('createTestimonial responds 201 with the saved row', async () => {
    const { res } = await run(testimonialsController.createTestimonial, {
        body: { name: 'New Person', text: 'Hello world' }
    });

    assert.equal(res.statusCode, 201);
    assert.equal(res.body.data.name, 'New Person');
});

test('updateTestimonial scopes to the route id', async () => {
    const created = await run(testimonialsController.createTestimonial, {
        body: { name: 'Before', text: 't' }
    });
    const id = created.res.body.data.id;

    const { res } = await run(testimonialsController.updateTestimonial, {
        params: { id },
        body: { name: 'After' }
    });

    assert.equal(res.body.data.id, id);
    assert.equal(res.body.data.name, 'After');
});

test('deleteTestimonial responds 200 on success', async () => {
    const created = await run(testimonialsController.createTestimonial, {
        body: { name: 'Temp', text: 't' }
    });

    const { res } = await run(testimonialsController.deleteTestimonial, {
        params: { id: created.res.body.data.id }
    });

    assert.equal(res.statusCode, 200);
    assert.equal(res.body.success, true);
});

test('a service error is forwarded to next() instead of crashing the response', async () => {
    const { res, forwarded } = await run(testimonialsController.getTestimonialById, {
        params: { id: 'does-not-exist' }
    });

    assert.ok(forwarded, 'expected next() to receive the error');
    assert.equal(forwarded.statusCode, 404);
    assert.equal(res.body, null, 'nothing should be written to the response');
});

test('a validation error surfaces as 400 through next()', async () => {
    const { forwarded } = await run(testimonialsController.createTestimonial, {
        body: { text: 'no name' }
    });

    assert.ok(forwarded);
    assert.equal(forwarded.statusCode, 400);
});