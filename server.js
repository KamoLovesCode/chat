const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {}; // Store connected users
let chats = {}; // Temporary chat storage

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

server.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
