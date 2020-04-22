const urlStats = require('./urlstats');

test('https://example.org normal simple response', async () => {
    expect(await urlStats('https://example.org')).toEqual(expect.objectContaining({
        url: 'https://example.org',
        title: 'Example Domain',
        version: 'HTML 5',
        headings: {h1: 1},
        images: 0,
        biggestImage: undefined,
        links: {
            internal: [],
            external: ['https://www.iana.org/domains/example']
        }
    }));
});

test('https://httpd.apache.org/docs/ XHTML doctype', async () => {
    expect(await urlStats('https://httpd.apache.org/docs/')).toEqual(expect.objectContaining({
        url: 'https://httpd.apache.org/docs/',
        title: 'Documentation: Apache HTTP Server - The Apache HTTP Server Project',
        version: 'XHTML 1.0 Transitional',
        headings: {h1: 8},
        images: 3,
        biggestImage: 'https://www.apache.org/images/SupportApache-small.png'
    }));
});

test('https://example.org 404', async () => {
    expect(await urlStats('https://example.org/doesnNotExist')).toEqual({
        url: 'https://example.org/doesnNotExist',
        error: 'request to https://example.org/doesnNotExist failed with status 404: Not Found'
    });
});