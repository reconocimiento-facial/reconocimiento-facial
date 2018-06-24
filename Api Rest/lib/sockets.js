'use strict';

const socketio = require('socket.io');
const logger = require('./logger');

const initServer = function(server) {
    const io = socketio(server).of(process.env.URL_PATH);
    logger.info('Se Inicia los socket');
    io.on('connection', function(socket) {
        logger.info('Se conecta');
        socket.emit('server-can-enter');
        socket.on('disconnect', function() {
            logger.info('Se desconecta');
        });
        socket.on('force-open', function() {
            console.log('force open');
            io.emit('force-open');
        });
        socket.on('door-open', function(status) {
            io.emit('status-change', status);
        });
        socket.on('door-close', function(status) {
            io.emit('status-change', status);
        });
        socket.on('want-to-enter', function(person) {
            io.emit('person-want-enter', person);
        });
    });

};

module.exports = initServer;
