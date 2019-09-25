const express = require('express');
const daoScrapper = require('./dao-scraper');

const app = express();
// noinspection JSUnusedLocalSymbols
const expressWs = require('express-ws')(app);

const wsClients = [];

daoScrapper.start().catch(e => {
    console.error("There is an error in dao-scrapper!");
    throw new Error(e);
});

daoScrapper.onUpdate = () => {
    let daoData = daoScrapper.toString();
    for (let i = 0; i < wsClients.length; i++) {
        let ws = wsClients[i];
        if (ws.readyState === ws.OPEN) {
            ws.send(daoData);
            i++;
        }
        else {
            wsClients.splice(i, 1);
        }
    }
};

app.get('/', function (req, res) {
    res.json(daoScrapper.getData());
});

app.ws('/', function (ws) {
    wsClients.push(ws);
});


function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

app.listen(normalizePort(process.env.PORT || '3000'));