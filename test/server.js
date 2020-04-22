const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'files')));

/*
app.get('/', (request, response) => {
    response.end('');
});
*/

function start(port = 4567) {
    return new Promise(resolve => server = app.listen(port, function () {
        resolve();
    }));
}

function stop() {
    return new Promise(resolve => server.close(resolve));
}

module.exports = {
    start, stop
};

if (require.main === module && process.argv && process.argv.length > 2) {
    start(process.argv[2]).then(_ => console.log(`listening on ${process.argv[2]}`));
}
