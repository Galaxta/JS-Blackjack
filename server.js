const express = require('express');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;
const wsPort = 8080;

// Initialize or load player database
const dbPath = path.join(__dirname, 'playerDb.json');
let playerDb = { players: {} };

if (fs.existsSync(dbPath)) {
    playerDb = JSON.parse(fs.readFileSync(dbPath));
}

// Save database function
const saveDb = () => {
    fs.writeFileSync(dbPath, JSON.stringify(playerDb, null, 2));
};

app.use(express.static(path.join(__dirname, 'build')));

// HTTP Server
const httpServer = app.listen(port, () => {
    console.log(`HTTP Server running on port ${port}`);
});

// WebSocket Server
const wss = new WebSocket.Server({ port: wsPort });
console.log(`WebSocket server listening on port ${wsPort}`);

const players = new Map();

wss.on('connection', (ws, req) => {
    const ip = req.socket.remoteAddress;
    
    ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'register') {
            const playerId = data.playerId;
            players.set(ws, { id: playerId, ip });
            
            // Update player database
            if (!playerDb.players[playerId]) {
                playerDb.players[playerId] = {
                    ip,
                    wins: 0,
                    totalGames: 0,
                    bestStreak: 0,
                    firstSeen: new Date().toISOString()
                };
            }
            
            playerDb.players[playerId].lastSeen = new Date().toISOString();
            saveDb();
        }
    });

    ws.on('close', () => {
        const player = players.get(ws);
        if (player) {
            console.log(`Player ${player.id} disconnected`);
            players.delete(ws);
        }
        console.log(`Active players: ${players.size}`);
    });

    console.log(`New connection from ${ip}. Active players: ${players.size}`);
});

// Regular cleanup and status updates
setInterval(() => {
    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(`Current active players: ${players.size} | IPs: ${Array.from(players.values()).map(p => p.ip).join(', ')}`);
}, 30000);
