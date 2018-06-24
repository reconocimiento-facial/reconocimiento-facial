const io = require('socket.io-client');
const config = require('../config');
const socket = io(config.API);
const events = require('./events-emitter');
const status = require('../status');

socket.on('connect', () => {
    socket.on('person-want-enter', (person) => {
        events.emit('person-want-enter', person);
    });
    socket.on('force-open', () => {
        events.emit('force-open');
    })
    events.on('door-open', () =>  {
        socket.emit('door-open', status);
    });
    events.on('door-close', function() {
        socket.emit('door-close', status);
    });
});
