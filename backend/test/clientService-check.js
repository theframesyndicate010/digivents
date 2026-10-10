const assert = require('node:assert/strict');
const test = require('node:test');
const { db, reset, destroy } = require('./helpers/testDb');
const clientService = require('../src/services/clientService');

test.beforeEach(reset);
test.after(destroy);

const newLogo = () => ({ filename: `acme-${Date.now()}-${Math.random().toString(36).slice(2)}.png` });

test('createClient stores an uploaded logo under /uploads/images', async () => {
    const created = await clientService.createClient({ name: 'Acme' }, newLogo());

    assert.equal(created.name, 'Acme');
    assert.match(created.logo, /^\/uploads\/images\/.+\.png$/);

    const [row] = await db('clients').where({ id: created.id });
    assert.equal(row.logo, created.logo);
});

test('createClient without a file stores a null logo', async () => {
    const created = await clientService.createClient({ name: 'NoLogo Co' });
    assert.equal(created.logo, '');
});

test('createClient rejects a missing name with 400', async () => {
    await assert.rejects(
        () => clientService.createClient({ website: 'https://acme.test' }),
        (error) => error.statusCode === 400
    );
});

test('fetchAllClients returns the logo field', async () => {
    const created = await clientService.createClient({ name: 'Listed Co' }, newLogo());
    const all = await clientService.fetchAllClients();

    const found = all.find((c) => c.id === created.id);
    assert.ok(found, 'created client should be listed');
    assert.equal(found.logo, created.logo);
});

test('updateClient replaces the logo when a new file is uploaded', async () => {
    const created = await clientService.createClient({ name: 'Swap Co' }, newLogo());
    const updated = await clientService.updateClient(created.id, { name: 'Swap Co' }, newLogo());

    assert.notEqual(updated.logo, created.logo);
    assert.match(updated.logo, /^\/uploads\/images\//);
});

test('updateClient preserves the stored logo when no file is sent', async () => {
    const created = await clientService.createClient({ name: 'Keep Co' }, newLogo());
    const updated = await clientService.updateClient(created.id, { name: 'Keep Co Renamed' });

    assert.equal(updated.logo, created.logo);
    assert.equal(updated.name, 'Keep Co Renamed');
});

test('updateClient clears the logo when an explicit empty logo is sent', async () => {
    const created = await clientService.createClient({ name: 'Clear Co' }, newLogo());
    const updated = await clientService.updateClient(created.id, { logo: '' });

    assert.equal(updated.logo, '');
});

test('updateClient 404s for an unknown id', async () => {
    await assert.rejects(
        () => clientService.updateClient('does-not-exist', { name: 'X' }),
        (error) => error.statusCode === 404
    );
});

test('deleteClient removes the row and 404s on repeat', async () => {
    const created = await clientService.createClient({ name: 'Temp Co' });
    assert.equal(await clientService.deleteClient(created.id), true);

    await assert.rejects(
        () => clientService.deleteClient(created.id),
        (error) => error.statusCode === 404
    );
});

test('getClientById 404s for an unknown id', async () => {
    await assert.rejects(
        () => clientService.getClientById('nope'),
        (error) => error.statusCode === 404
    );
});