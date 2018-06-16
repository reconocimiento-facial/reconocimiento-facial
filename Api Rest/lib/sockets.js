'use strict';

const socketio = require('socket.io');
const logger = require('./logger');

const initServer = function(server) {
    const io = socketio(server).of(process.env.URL_PATH);

    io.on('connection', function(socket) {
        logger.info('Se conecta');
        socket.on('disconnect', function() {
            logger.info('Se desconecta');
        });
        socket.on('app-send-confirm', function() {

        });
        socket.on('app-send-want', function(data) {
            logger.info('Se app-send-want', data);
            socket.emit('server-can-enter');
        });
    });

};

module.exports = initServer;
