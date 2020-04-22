const express = require('express');
const app = express();
const urlStats = require('./urlstats')

app.get('/', async (request, response) => {
    const { url } = request.query;
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    if (!url) {
        response.send(JSON.stringify({
            error: 'missing url'
        }));
    } else {
        const stats = await urlStats(url);
        response.send(JSON.stringify(stats));
    }
});

const port = 4000;

const server = app.listen(port, _ => console.info(`server started listening on ${port}`));
