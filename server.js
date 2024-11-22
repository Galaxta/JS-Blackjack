const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'build')));

const server = app.listen(port, () => {
    process.stdout.write('\x1b[36m%s\x1b[0m', `Server running on port ${port}\n`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', ws => {
    process.stdout.write('\x1b[32m%s\x1b[0m', `Player joined! Active players: ${wss.clients.size}\n`);

    ws.on('close', () => {
        process.stdout.write('\x1b[31m%s\x1b[0m', `Player left. Active players: ${wss.clients.size}\n`);
    });
});
