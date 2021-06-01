const channelManager = require('../../channels/channelManager');

const handleConnection = (client) => {
    console.log(`New Client Connected! ID: ${client.id}`);

    client.on('disconnect', () => {
        console.log(`Client disconnected. socket ID: ${client.id}`);
    });

    // client.on('counterparties', async () => {
    //     const counterpartiesList = await channelManager.getCounterparties(true, (res) => {
    //         const { data, error } = res;
    //         if (error || !data) return console.log(error || 'There is problem with listing Counterparties');
    //         client.emit('counterparties', data.map(c => c.ip));
    //     });
    // })
};

const connect = () => {
    const config = require('../../../config/env.config');
    const { SOCKET_PORT, socketIoConfig } = config;
    const io = require('socket.io')(SOCKET_PORT, socketIoConfig);
    io.on('connection', handleConnection);

    setInterval(() => {
        const data = { data: 'No news is a good news :)'};
        io.emit('dataFeed', data)
    }, 2000);
};

module.exports = {
    connect
}