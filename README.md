# Integral Racer

A real-time multiplayer math competition game where players race to solve challenging integration problems.  
Built with Node.js and Socket.io, Integral Racer synchronizes gameplay across multiple clients and tracks scoring dynamically in competitive rounds.

---

## Features

- Real-time multiplayer gameplay using WebSockets
- Shared integration problems inspired by MIT Integration Bee
- Competitive race-style scoring system
- Live synchronization across all connected players
- Joinable game lobby system
- Dynamic score tracking and round management

---

## Tech Stack

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express
- Socket.io

**Libraries**
- math.js (for symbolic/math evaluation)
  
---

## How It Works

1. A game session is created or joined through the lobby.
2. All players receive the same integration problem simultaneously.
3. Players solve the integral as quickly as possible.
4. Submissions are evaluated and scored in real-time.
5. Scores update instantly across all connected clients.
6. The fastest correct solver earns the most points.

The server manages:
- Player connections
- Problem broadcasting
- Answer validation
- Score synchronization
- Game state consistency

---

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/your-username/integral-racer.git
cd integral-racer
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the server

```bash
node server.js
```

### 4. Open in browser

Visit:

```
http://localhost:3000
```

Open multiple tabs or devices to simulate multiplayer gameplay.

---

## Project Structure

```
Integral-Racer/
│
├── public/
│   ├── index.html
│   ├── gameplay.html
│   ├── styles.css
│   ├── multiplayer.js
│
├── server.js
├── package.json
├── README.md
└── assets/
```

---

## Technical Highlights

- Implemented real-time bidirectional communication using Socket.io
- Designed a synchronized multiplayer game state to prevent race condition inconsistencies
- Built dynamic answer validation using math parsing libraries
- Managed concurrent player sessions and live scoreboard updates
- Structured server-client architecture to separate game logic from UI rendering

---

## License

This project is licensed under the MIT License.

---

## Author

Shaan Cheruvu
GitHub: https://github.com/Shaan50
