const orderBooksService = require('../services/orderbooks');

const handleConnection = (io) => {
    return (client) => {
        const clientOptions = {};
        const ip = client.handshake.headers['x-forwarded-for'] || client.conn.remoteAddress.split(":")[3];
        console.log(`New Client Connected! ID: ${client.id}, IP: ${ip}`);
    
        client.on('disconnect', () => {
            orderBooksService.clearOrderbooksFromIp(ip);
            io.emit('aksfor-orderbook-update');
            console.log(`Client disconnected. socket ID: ${client.id}, IP: ${ip}`);
        });

        client.on('orderbook-market-filter', (filter) => {
            clientOptions.orderbookMarketFilter = filter;
            emitOrderbookData(client, clientOptions.orderbookMarketFilter)
        });

        client.on('update-orderbook', () => {
            emitOrderbookData(client, clientOptions.orderbookMarketFilter)
        });

        client.on('dealer-data', (dealerData) => {
            console.log('new Dealer Data');
            console.log(dealerData);
            const { tradesData, addressPair } = dealerData;
            orderBooksService.addToDealersData(ip, addressPair, tradesData);
            io.emit('aksfor-orderbook-update');
        });
    }
};

const emitOrderbookData = (socket, marketFilter) => {
    if (!marketFilter) return;
    const data = orderBooksService.getAllDealersData();
    const filteredData = filterOrderBookData(data, marketFilter);
    socket.emit('orderbook-data', filteredData);
};

const filterOrderBookData = (data, filter) => {
    const { firstId, secondId } = filter;
    if (!firstId || !secondId) return []; 
    return data.filter(ob => (
        (ob.propIdForSale === firstId && ob.propIdDesired === secondId) || 
        (ob.propIdForSale === secondId && ob.propIdDesired === firstId)
    ));
};

const connect = () => {
    const config = require('../../config/env.config');
    const { SOCKET_PORT, socketIoConfig } = config;
    const io = require('socket.io')(SOCKET_PORT, socketIoConfig);
    io.on('connection', handleConnection(io));
};

module.exports = {
    connect
}