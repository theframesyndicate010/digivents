const assert = require('node:assert/strict');
const test = require('node:test');
const { db, reset, destroy } = require('./helpers/testDb');
const testimonialService = require('../src/services/testimonialService');

test.beforeEach(reset);
test.after(destroy);

const seed = (overrides = {}) => ({
    id: `t-${Math.random().toString(36).slice(2, 10)}`,
    name: 'Sample',
    text: 'Sample text',
    position: 0,
    is_active: true,
    ...overrides
});

test('fetchAllTestimonials returns only active rows', async () => {
    await db('testimonials').insert([
        seed({ name: 'Visible', position: 0, is_active: true }),
        seed({ name: 'Hidden', position: 1, is_active: false })
    ]);

    const rows = await testimonialService.fetchAllTestimonials();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].name, 'Visible');
});

test('fetchAllTestimonials orders by position', async () => {
    await db('testimonials').insert([
        seed({ name: 'Second', position: 2 }),
        seed({ name: 'First', position: 0 }),
        seed({ name: 'Third', position: 1 })
    ]);

    const rows = await testimonialService.fetchAllTestimonials();
    assert.deepEqual(rows.map((r) => r.name), ['First', 'Third', 'Second']);
});

test('fetchAllTestimonialsAdmin includes inactive rows', async () => {
    await db('testimonials').insert([
        seed({ name: 'Visible', position: 0, is_active: true }),
        seed({ name: 'Hidden', position: 1, is_active: false })
    ]);

    const rows = await testimonialService.fetchAllTestimonialsAdmin();
    assert.equal(rows.length, 2);
});

test('createTestimonial persists the row and normalizes is_active', async () => {
    const created = await testimonialService.createTestimonial({
        name: 'Bednidhi Traders',
        text: 'Great work',
        position: 3
    });

    assert.match(created.id, /^[0-9a-f-]{36}$/);
    assert.equal(created.is_active, true);
    assert.equal(created.position, 3);

    const row = await db('testimonials').where({ id: created.id }).first();
    assert.equal(row.name, 'Bednidhi Traders');
});

test('createTestimonial defaults position to 0', async () => {
    const created = await testimonialService.createTestimonial({ name: 'N', text: 'T' });
    assert.equal(created.position, 0);
});

test('createTestimonial rejects a missing name or text', async () => {
    await assert.rejects(
        () => testimonialService.createTestimonial({ text: 'orphan' }),
        (error) => error.statusCode === 400
    );
    await assert.rejects(
        () => testimonialService.createTestimonial({ name: 'No text' }),
        (error) => error.statusCode === 400
    );
});

test('updateTestimonial writes only the provided fields', async () => {
    const row = seed({ name: 'Old', text: 'old text', position: 5 });
    await db('testimonials').insert(row);

    const updated = await testimonialService.updateTestimonial(row.id, { name: 'New' });
    assert.equal(updated.name, 'New');
    assert.equal(updated.text, 'old text');
    assert.equal(updated.position, 5);
});

test('updateTestimonial can deactivate a row', async () => {
    const row = seed({ name: 'Toggle', is_active: true });
    await db('testimonials').insert(row);

    const updated = await testimonialService.updateTestimonial(row.id, { is_active: false });
    assert.equal(updated.is_active, false);

    const visible = await testimonialService.fetchAllTestimonials();
    assert.equal(visible.some((r) => r.id === row.id), false);
});

test('updateTestimonial 404s for an unknown id', async () => {
    await assert.rejects(
        () => testimonialService.updateTestimonial('missing', { name: 'X' }),
        (error) => error.statusCode === 404
    );
});

test('deleteTestimonial removes the row and 404s on repeat', async () => {
    const row = seed();
    await db('testimonials').insert(row);

    assert.equal(await testimonialService.deleteTestimonial(row.id), true);
    await assert.rejects(
        () => testimonialService.deleteTestimonial(row.id),
        (error) => error.statusCode === 404
    );
});

test('getTestimonialById 404s for an unknown id', async () => {
    await assert.rejects(
        () => testimonialService.getTestimonialById('missing'),
        (error) => error.statusCode === 404
    );
});