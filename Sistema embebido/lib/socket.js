const io = require('socket.io-client');
const socket = io(config.API);
const events = require('./events-emitter');
const status = require('./status');


socket.on('connect', () => {
    socket.on('person-want-enter', (data) => {
        events.emit('person-want-enter', data);
    });
    events.on('door-open', function() {
        socket.emit('door-open', status);
    });
    events.on('door-close', function(data) {
        socket.emit('door-close');
    });
});
