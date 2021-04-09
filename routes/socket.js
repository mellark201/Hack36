const io = require('socket.io-client');
const socket = io();

socket.on('connect', () => {
    console.log('Connected');
})

module.exports = socket;