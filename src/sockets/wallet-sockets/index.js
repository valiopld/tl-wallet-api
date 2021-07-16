const channelManager = require('../../channels/channelManager');
const ltcInstantTrade = require('../../trade-builder').ltcInstantTrade;
const tokenTokenTrade = require('../../trade-builder').tokenTokenTrade;
const api = require('../../services/tl-rpc-api');
const orderBooksService = require('../../services/orderbooks');
const socketOnEvents = {
    LTC_INSTANT_TRADE: 'LTC_INSTANT_TRADE',
    TOKEN_TOKEN_TRADE: 'TOKEN_TOKEN_TRADE',
}

const socketEmitEvents = {
    TRADE_REJECTION: 'TRADE_REJECTION',
}

const handleConnection = (io) => {
    return (client) => {
        const clientOptions = {};
        const ip = client.handshake.headers['x-forwarded-for'] || client.conn.remoteAddress.split(":")[3];
        console.log(`New Client Connected! ID: ${client.id}, IP: ${ip}`);
    
        client.on('disconnect', () => {
            orderBooksService.clearOrderbooksFromIp(ip);
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
            const { tradesData, addressPair } = dealerData;
            orderBooksService.addToDealersData(ip, addressPair, tradesData);
            emitOrderbookData(io, clientOptions.orderbookMarketFilter);
        });
    }
};

const emitOrderbookData = (socket, marketFilter) => {
    if (!marketFilter) return;
    const orderbookData = convertDealersData(orderBooksService.allDataByDealers);
    const filteredData = filterOrderBookData(orderbookData, marketFilter);
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

const convertDealersData = (rawData) => {
    const convertedData = [];
    const d1 = Object.values(rawData);
    d1.forEach(d => d.forEach(_d => _d.tradesData.forEach(__d => convertedData.push(__d))));
    return convertedData;
}

const blockCounter = (io) => {
    let oldHeight = 0;
    setInterval(async () => {
        const res = await api.getBestBlock();
        if (res.error || !res.data) return;
        const height = res.data.height
        if (oldHeight < height) {
            oldHeight = height;
            io.emit('newBlock', height);
            console.log(`New Block: ${height}`)
        }
    }, 5000);
}

const connect = () => {
    const config = require('../../../config/env.config');
    const { SOCKET_PORT, socketIoConfig } = config;
    const io = require('socket.io')(SOCKET_PORT, socketIoConfig);
    io.on('connection', handleConnection(io));
    blockCounter(io);
};

// const getCounterParties = (tradeConf) => {
//     return new Promise((res, rej) => {
//         const counterpartiesList = channelManager.getCounterparties(true, (result) => {
//             const { data, error } = result;
//             if (error || !data) {
//                 rej('There is problem with listing Counterparties');
//                 return console.log(error || 'There is problem with listing Counterparties');
//             }
//             res(data)
//         });
//     });
// }

module.exports = {
    connect
}