const handleConnection = (client) => {
    console.log(`New Client Connected! ID: ${client.id}`);
};

const connect = () => {
    const config = require('../../../config/env.config');
    const { SOCKET_PORT, socketIoConfig } = config;
    const io = require('socket.io')(SOCKET_PORT, socketIoConfig);
    io.on('connection', handleConnection);
};

module.exports = {
    connect
}