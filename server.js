const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let currentIntegralIndex = 0;
const integrals = fs.readFileSync(path.join(__dirname, 'public', 'integral_answers.txt'), 'utf-8').split('\n');

io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.emit('newIntegral', currentIntegralIndex);
    
    socket.on('submitAnswer', (data) => {
        const correctAnswer = integrals[currentIntegralIndex].trim();
        const isCorrect = checkAnswer(data.answer, correctAnswer);
        
        if (isCorrect) {
            currentIntegralIndex = Math.floor(Math.random() * integrals.length);
            io.emit('correctAnswer', data.username);
            io.emit('newIntegral', currentIntegralIndex);
        } else {
            socket.emit('wrongAnswer');
        }
    });
    
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

function checkAnswer(playerAnswer, correctAnswer) {
    const math = require('mathjs');
    const parseExpression = (expr) => {
        try {
            return math.parse(expr).compile();
        } catch (e) {
            console.error('Error parsing expression:', e);
            return null;
        }
    };

    const playerExpr = parseExpression(playerAnswer);
    const correctExpr = parseExpression(correctAnswer);

    if (playerExpr === null || correctExpr === null) {
        return false;
    }

    const xValues = Array.from({ length: 10 }, () => Math.random());

    return xValues.every(x => {
        const playerValue = playerExpr.evaluate({ x });
        const correctValue = correctExpr.evaluate({ x });

        return Math.abs(math.re(playerValue) - math.re(correctValue)) < 0.0001 && Math.abs(math.im(playerValue) - math.im(correctValue)) < 0.0001;
    });
}