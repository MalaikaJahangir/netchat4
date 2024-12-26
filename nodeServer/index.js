const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: 'http://127.0.0.1:5501', // Allow the frontend origin (adjust if different)
        methods: ['GET', 'POST']
    }
});

const users = {};

io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('new-user-joined', (Name) => {
        console.log('New user joined:', Name);
        users[socket.id] = Name; // Store the user's name with their socket ID
        socket.broadcast.emit('user-joined', Name);
    });

    socket.on('send', (message) => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    socket.on('disconnect', () => {
        const userName = users[socket.id];
        console.log('User disconnected:', userName);
        if (userName) {
            socket.broadcast.emit('left', { name: userName }); // Send the name of the user who left
        }
        delete users[socket.id]; // Clean up the user from the list
    });
});

// Start the server
const PORT = 3005;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
