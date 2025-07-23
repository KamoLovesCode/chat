const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; // Store connected users
let chats = {}; // Temporary chat storage

// Initialize Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Handle user login
    socket.on('login', (username) => {
        users[socket.id] = username;
        chats[socket.id] = [];
        io.emit('userList', Object.values(users)); // Broadcast updated user list
    });

    // Handle sending messages
    socket.on('sendMessage', ({ to, message }) => {
        if (users[to]) {
            chats[to].push({ from: users[socket.id], message });
            io.to(to).emit('receiveMessage', { from: users[socket.id], message });
        }
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
        delete users[socket.id];
        delete chats[socket.id];
        io.emit('userList', Object.values(users)); // Broadcast updated user list
    });
});

// Initialize Next.js
nextApp.prepare()
    .then(() => {
    // Make sure this route comes before the catch-all handler
    // Add middleware for JSON parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    
    // Add any API routes here
    
    // Catch-all handler for Next.js
    app.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(3000, () => {
        console.log('Server is running on http://localhost:3000');
    });
})
.catch((ex) => {
    console.error('An error occurred during Next.js initialization:');
    console.error(ex.stack);
    process.exit(1);
});
