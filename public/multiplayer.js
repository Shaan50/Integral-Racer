//const socket = io();

let gameId = prompt("Enter Game ID:"); // You can also implement a way to generate or get a game ID
if (gameId) {
    socket.emit('joinGame', gameId);

    // Handle receiving answers
    socket.on('receiveAnswer', (data) => {
        // Implement logic to handle the received answer
        console.log('Received answer from another player:', data);
        // For example, you might check if the answer is correct and update the game state
    });

    // Handle player list updates
    socket.on('playerList', (playerIds) => {
        console.log('Current players in the game:', playerIds);
        // Update the UI to show the list of players
    });

    // Example function to emit an answer
    function submitAnswer(answer) {
        socket.emit('submitAnswer', { gameId, answer });
    }

    // Add more multiplayer functionality as needed
    document.getElementById('create-game').addEventListener('click', () => {
        const newGameId = generateGameId(); // Implement this function to generate unique IDs
        socket.emit('joinGame', newGameId);
        gameId = newGameId;
        alert(`New game created with ID: ${gameId}`);
    });
    
    document.getElementById('join-game').addEventListener('click', () => {
        gameId = document.getElementById('game-id').value;
        if (gameId) {
            socket.emit('joinGame', gameId);
        }
    });
    
    function generateGameId() {
        return 'game-' + Math.random().toString(36).substr(2, 9); // Simple ID generation
    }
    socket.on('playerList', (playerIds) => {
        const playerList = document.getElementById('players');
        playerList.innerHTML = '';
        playerIds.forEach(id => {
            const listItem = document.createElement('li');
            listItem.textContent = id;
            playerList.appendChild(listItem);
        });
    });
}