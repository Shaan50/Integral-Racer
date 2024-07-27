const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = 3000;
let currentIntegralIndex = 0;

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public'

io.on('connection', (socket) => {
    console.log('A user connected');

    // Send the current integral to the new client
    socket.emit('integral', { index: currentIntegralIndex });

    socket.on('submitAnswer', (answer) => {
        // Broadcast answer to all clients
        io.emit('submitAnswer', answer);
    });

    socket.on('draw', (dataURL) => {
        // Broadcast drawing data to all clients
        socket.broadcast.emit('draw', dataURL);
    });

    socket.on('clear', () => {
        // Broadcast clear event to all clients
        socket.broadcast.emit('clear');
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});