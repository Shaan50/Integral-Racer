const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let games = {}; // Store game states
let playerSockets = {}; // Map to store socket ids for players
let playerNicknames = {}; // Store player nicknames
let playerScores = {}; // Store player scores

const players = {}; // Example structure for holding players by game ID

// Endpoint to get players for a specific game
app.get('/players', (req, res) => {
    const gameId = req.query.gameId;
    if (games[gameId]) {
        res.json(Object.values(games[gameId].players));
    } else {
        res.status(404).json({ error: 'Game not found' });
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle nickname setting
    socket.on('setNickname', (nickname) => {
        playerNicknames[socket.id] = nickname;
        // Initialize player scores
        playerScores[socket.id] = 0;
    });

    // Create new game
    socket.on('createGame', () => {
        console.log("SDKF")
        const gameId = generateGameId();
        games[gameId] = { players: [socket.id], state: { integralIndex: 0 } };
        playerSockets[socket.id] = gameId;
        socket.emit('gameCreated', gameId);
        console.log(`Game created: ${gameId}`);
    });

    // Join existing game
    socket.on('joinGame', (gameId) => {
        if (games[gameId] && games[gameId].players.length < 2) {
            games[gameId].players.push(socket.id);
            playerSockets[socket.id] = gameId;
            io.to(games[gameId].players[0]).emit('playerJoined',playerNicknames[socket.id]); // Notify first player
            socket.emit('gameJoined', gameId);
            console.log(`Player joined game: ${gameId}`);

            // Send initial game state and scores to both players
            const integralIndex = games[gameId].state.integralIndex;
            io.to(games[gameId].players[0]).emit('gameStateUpdated', integralIndex);
            io.to(games[gameId].players[1]).emit('gameStateUpdated', integralIndex);
            io.to(games[gameId].players[0]).emit('scoreUpdated', playerScores);
            io.to(games[gameId].players[1]).emit('scoreUpdated', playerScores);
        } else {
            socket.emit('error', 'Game is full or does not exist');
        }
    });

    // New: Handle the startGame event
    socket.on('startGame', (id) => {
        console.log("P");
        if (games[id]) {
            // Notify all players in the game that the game is starting
            console.log("ENTERBJHAGDHJASGDTYHGASFDHYSAD");
            io.to(id).emit('gameStarted');
        } else {
            socket.emit('error', 'Game not found');
        }
    });

    // Handle integral answer and score updates
    socket.on('answerCorrect', () => {
        const gameId = playerSockets[socket.id];
        if (games[gameId]) {
            const players = games[gameId].players;
            const otherPlayer = players.find(id => id !== socket.id);
            if (otherPlayer) {
                // Update scores
                playerScores[socket.id]++;
                io.to(otherPlayer).emit('scoreUpdated', playerScores);
                io.to(socket.id).emit('scoreUpdated', playerScores);
                
                // Update integral
                games[gameId].state.integralIndex = (games[gameId].state.integralIndex + 1) % 20; // Example for 20 integrals
                const newIntegralIndex = games[gameId].state.integralIndex;
                
                io.to(players[0]).emit('gameStateUpdated', newIntegralIndex);
                io.to(players[1]).emit('gameStateUpdated', newIntegralIndex);
            }
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
                io.to(games[gameId].players[0]).emit('playerLeft',playerNicknames[socket.id]);
            }
            delete playerSockets[socket.id];
        }
        console.log('User disconnected');
    });
});

function generateGameId() {
    return Math.random().toString(36).substring(2, 7).toUpperCase(); // Generate random 5 character game ID
}

server.listen(3000, () => {
    console.log('Server is running on port 3000');
});