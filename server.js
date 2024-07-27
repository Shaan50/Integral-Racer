const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

let games = {}; // Store game states
let playerSockets = {}; // Map to store socket ids for players

io.on('connection', (socket) => {
    console.log('A user connected');

    // Create new game
    socket.on('createGame', () => {
        const gameId = generateGameId();
        games[gameId] = { players: [socket.id], state: {} };
        playerSockets[socket.id] = gameId;
        socket.emit('gameCreated', gameId);
        console.log(`Game created: ${gameId}`);
    });

    // Join existing game
    socket.on('joinGame', (gameId) => {
        if (games[gameId] && games[gameId].players.length < 2) {
            games[gameId].players.push(socket.id);
            playerSockets[socket.id] = gameId;
            io.to(games[gameId].players[0]).emit('playerJoined'); // Notify first player
            socket.emit('gameJoined', gameId);
            console.log(`Player joined game: ${gameId}`);
        } else {
            socket.emit('error', 'Game is full or does not exist');
        }
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        const gameId = playerSockets[socket.id];
        if (gameId && games[gameId]) {
            games[gameId].players = games[gameId].players.filter(id => id !== socket.id);
            if (games[gameId].players.length === 0) {
                delete games[gameId];
            } else {
                io.to(games[gameId].players[0]).emit('playerLeft');
            }
            delete playerSockets[socket.id];
        }
        console.log('User disconnected');
    });
});

// Route to fetch player list for a game
app.get('/players', (req, res) => {
    const gameId = req.query.gameId;
    if (games[gameId]) {
        const playerIds = games[gameId].players;
        const playerNames = playerIds.map(id => io.sockets.sockets.get(id).handshake.query.username || 'Unknown');
        res.json(playerNames);
    } else {
        res.status(404).json([]);
    }
});

function generateGameId() {
    return Math.random().toString(36).substring(2, 7).toUpperCase(); // Generate random 5 character game ID
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});