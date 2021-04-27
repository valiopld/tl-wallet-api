const handleConnection = (client) => {
    console.log(`New Counterparty Connection ${client.id}`);
};

const connect = () => {
    const config = require('../../../config/env.config');
    const { TC_SOCKET_PORT, socketIoConfig } = config;
    const io = require('socket.io')(TC_SOCKET_PORT, socketIoConfig);
    io.on('connection', handleConnection);
};

module.exports = {
    connect,
}