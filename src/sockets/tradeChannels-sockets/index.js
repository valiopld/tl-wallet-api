const channelManager = require('../../channels/channelManager');

const handleConnection = (client) => {
    console.log(`New Counterparty connection - socket ID: ${client.id}`);
    const ip = client.handshake.headers['x-forwarded-for'] || client.conn.remoteAddress.split(":")[3];
    channelManager.addCounterparty(ip);

    client.on('disconnect', () => {
        console.log(`Counterparty disconnected. socket ID: ${client.id}`);
        channelManager.disconnectCounterperty(ip);
    });
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