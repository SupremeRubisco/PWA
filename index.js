var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

var locations = {}; // Object to store locations

var countdown = 60; // Countdown timer starts at 60 seconds

// Update countdown timer every second
setInterval(() => {
    countdown--;
    if (countdown < 0) countdown = 60; // Reset countdown timer
}, 1000);

io.on('connection', (socket) => {
    socket.emit('initialLocations', locations); // Emit initial locations to new client
    socket.emit('initialCountdown', countdown); // Emit initial countdown to new client

    socket.on('locationUpdate', (location) => {
        locations[socket.id] = location; // Update location
        io.emit('newLocation', { id: socket.id, location: location }); // Emit new location to all clients
    });

    socket.on('disconnect', () => {
        delete locations[socket.id]; // Remove location
        io.emit('removeLocation', socket.id); // Emit remove location to all clients
    });
});

// Emit 'updateLocation' event to all clients every 60 seconds
setInterval(() => {
    io.emit('updateLocation');
    countdown = 60;
}, 60000);

http.listen(3000, function() {
    console.log('listening on *:3000');
});