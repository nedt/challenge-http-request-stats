const urlStats = require('./urlstats');
const testServer = require('../test/server');

testServerPort = 4567;

beforeAll(() => testServer.start(testServerPort));
afterAll(() => testServer.stop());

test(`http://localhost:${testServerPort}/test.html`, async () => {
    expect(await urlStats(`http://localhost:${testServerPort}/test.html`)).toEqual(expect.objectContaining({
        url: `http://localhost:${testServerPort}/test.html`,
        title: 'Test document',
        version: 'HTML 5',
        headings: {h1: 1},
        images: 0,
        biggestImage: undefined,
        links: {
            internal: [],
            external: []
        }
    }));
});

test(`http://localhost:${testServerPort}/nodoctype.html`, async () => {
    expect(await urlStats(`http://localhost:${testServerPort}/nodoctype.html`)).toEqual(expect.objectContaining({
        url: `http://localhost:${testServerPort}/nodoctype.html`,
        title: 'No Doctype',
        version: undefined,
        headings: {},
        images: 0,
        biggestImage: undefined,
        links: {
            internal: [],
            external: []
        }
    }));
});

test(`http://localhost:${testServerPort}/404.html`, async () => {
    expect(await urlStats(`http://localhost:${testServerPort}/404.html`)).toEqual(expect.objectContaining({
        url: `http://localhost:${testServerPort}/404.html`,
        error: `request to http://localhost:${testServerPort}/404.html failed with status 404: Not Found`
    }));
});

test(`http://localhost:${testServerPort}/xhtml.html`, async () => {
    expect(await urlStats(`http://localhost:${testServerPort}/xhtml.html`)).toEqual(expect.objectContaining({
        url: `http://localhost:${testServerPort}/xhtml.html`,
        version: 'XHTML 1.0 Strict'
    }));
});

test(`http://localhost:${testServerPort}/images.html`, async () => {
    expect(await urlStats(`http://localhost:${testServerPort}/images.html`)).toEqual(expect.objectContaining({
        url: `http://localhost:${testServerPort}/images.html`,
        version: 'HTML 5',
        images: 4,
        biggestImage: ''
    }));
});
