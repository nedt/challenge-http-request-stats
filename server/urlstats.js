const fetch = require('node-fetch');
const cheerio = require('cheerio');

async function fetchBody(url) {
    const result = await fetch(url);

    if (!result.ok) {
        throw `request to ${url} failed with status ${result.status}: ${result.statusText}`;
    }

    return await result.text();
}

function extractVersion(body) {
    const doctype = body.match(/<!DOCTYPE ([^>]*)>/i);
    if (!doctype || !doctype.length) {
        return undefined;
    }
    if (doctype[1] === 'html') {
        return 'HTML 5';
    }
    const identifier = doctype[1].match(/html PUBLIC "-\/\/[^\/]+\/\/DTD (X?HTML [^\/]+)/i);
    if (identifier && identifier.length) {
        return identifier[1];
    }
    return doctype[1];
}

function getResponseSize(url, timeout = 3000) {
    return new Promise(async (resolve, reject) => {
        const readTimeout = setTimeout(_ => reject('timeout'), timeout);
        const result = await fetch(url);
        if (!result.ok || !result.body) {
            reject('read failed');
        }
        if (result.headers.has('Content-Length')) {
            clearTimeout(readTimeout);
            resolve(parseInt(result.headers.get('Content-Length')));
        } else {
            let size = 0;
            result.body.on('data', chunk => size += chunk.length);
            result.body.on('end', _ => {
                clearTimeout(readTimeout);
                resolve(size);
            });
        }
    });
}

// NOTE we assume filesize
async function biggestImage($, base) {
    let biggestImage;
    let biggestSize = 0;
    const img = $('img, picture, picture source');
    for (let i = 0; i < img.length; ++i) {
        // TODO absolutize
        const src = $(img[i]).attr('src');
        const srcset = $(img[i]).attr('srcset');
        const sources = srcset ? srcset.split(' ') : [];
        if (src) {
            sources.push(src);
        }
        for (let j = 0; j < sources.length; ++j) {
            const source = new URL(sources[j], base);
            const size = await getResponseSize(source);
            if (size > biggestSize) {
                biggestSize = size;
                biggestImage = source.toString();
            }
        }
    }

    return biggestImage;
}

function isExternal(url, base) {
    const baseUrl = new URL(base);
    const checkUrl = new URL(url, base);
    if (baseUrl.host !== checkUrl.host) {
        return true;
    }
    return baseUrl.origin !== checkUrl.origin;
}

function countLinks($, base) {
    const links = {
        external: [],
        internal: []
    };
    $('a[href]').each((i, el) => {
        const href = $(el).attr('href');
        if (isExternal(href, base)) {
            links.external.push(href);
        } else {
            links.internal.push((new URL(href, base)).toString());
        }
    });
    return links;
}

async function urlStats(url) {
    const stats = { url };
    const startLoading = Date.now();

    try {
        const body = await fetchBody(url);
        stats.loadingTime = Date.now() - startLoading;
        const $ = cheerio.load(body);

        stats.version = extractVersion(body);
        stats.title = $('head title').text();
        stats.headings = {};
        for (let i = 1; i <= 7; ++i) {
            const headings = $(`h${i}`);
            if (headings.length) {
                stats.headings[`h${i}`] = headings.length;
            }
        }
        stats.images = $('img, picture, svg').length;
        stats.biggestImage = await biggestImage($, url);
        stats.links = countLinks($, url);
    } catch (e) {
        stats.error = e.message || e;
    }

    return stats;
}

module.exports = urlStats;

if (require.main === module && process.argv && process.argv.length > 2) {
    (async _ => console.log(await urlStats(process.argv[2])))();
}
