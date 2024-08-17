document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    const usernameInput = document.getElementById('username');
    const createGameBtn = document.getElementById('createGameBtn');
    const joinGameBtn = document.getElementById('joinGameBtn');
    const gameIdField = document.getElementById('gameIdField');
    const gameIdInput = document.getElementById('gameId');
    const joinGameConfirmBtn = document.getElementById('joinGameConfirmBtn');

    let username = '';

    createGameBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        if (username) {
            socket.emit('setNickname', username);
            socket.emit('createGame');
        } else {
            alert('Please enter a username.');
        }
    });

    joinGameBtn.addEventListener('click', () => {
        gameIdField.style.display = 'block';
    });

    joinGameConfirmBtn.addEventListener('click', () => {
        username = usernameInput.value.trim();
        const gameId = gameIdInput.value.trim();
        if (username && gameId) {
            socket.emit('setNickname', username);
            socket.emit('joinGame', gameId);
        } else {
            alert('Please enter a username and game ID.');
        }
    });

    socket.on('gameCreated', (gameId) => {
        window.location.href = `index.html?gameId=${gameId}&username=${username}`;
    });

    socket.on('gameJoined', (gameId) => {
        window.location.href = `index.html?gameId=${gameId}&username=${username}`;
    });

    socket.on('error', (message) => {
        alert(message);
    });
});