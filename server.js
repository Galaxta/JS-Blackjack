const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const port = 3000;
const wsPort = 8080;

app.use(express.static(path.join(__dirname, 'build')));

// HTTP Server
const httpServer = app.listen(port, () => {
    const networkInterfaces = require('os').networkInterfaces();
    const ip = Object.values(networkInterfaces)
        .flat()
        .find(details => details.family === 'IPv4' && !details.internal)?.address;
        
    console.log(`HTTP Server running on port ${port}`);
    console.log(`Local access: http://localhost:${port}`);
    console.log(`Network access: http://${ip}:${port}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ port: wsPort });
console.log(`WebSocket server listening on port ${wsPort}`);

const players = new Map();

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    players.set(ws, { ip });
    
    ws.on('close', () => {
        players.delete(ws);
        console.log(`Active players: ${players.size}`);
    });

    console.log(`New connection from ${ip}. Active players: ${players.size}`);
});

// Regular status updates
setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Current active players: ${players.size} | IPs: ${Array.from(players.values()).map(p => p.ip).join(', ')}`);
}, 30000);
