const orderBooksService = require('../services/orderbooks');
const ChannelSwap = require('../channels/channel').ChannelSwap;

const handleConnection = (io) => {
    return (client) => {
        const clientOptions = {};
        // const ip = client.handshake.headers['x-forwarded-for'] || client.conn.remoteAddress.split(":")[3];
        console.log(`New Client Connected! ID: ${client.id}`);
    
        client.on('disconnect', () => {
            // orderBooksService.clearOrderbooksFromIp(ip);
            orderBooksService.clearOrderbooksBySocketId(client.id);
            io.emit('aksfor-orderbook-update');
            console.log(`Client disconnected. socket ID: ${client.id}`);
        });

        client.on('orderbook-market-filter', (filter) => {
            clientOptions.orderbookMarketFilter = filter;
            emitOrderbookData(client, clientOptions.orderbookMarketFilter)
        });

        client.on('update-orderbook', () => {
            emitOrderbookData(client, clientOptions.orderbookMarketFilter)
        });

        // client.on('dealer-data', (dealerData) => {
        //     console.log('new Dealer Data');
        //     console.log(dealerData);
        //     const { tradesData, addressPair } = dealerData;
        //     orderBooksService.addToDealersData(socket.id, addressPair, tradesData);
        //     io.emit('aksfor-orderbook-update');
        // });

        client.on('init-trade', (tradeOptions) => {
            const match = orderBooksService.findDealerByTrade(tradeOptions);
            if (!match) {
                const res = orderBooksService.addToDealersData2(client.id, tradeOptions);
                if (!res || res.error || !res.data) {
                    client.emit('error_message', `Wrong Provided Data!`);
                } else {
                    io.emit('aksfor-orderbook-update');
                    const positions = orderBooksService.getTradesById(client.id);
                    client.emit('opened-positions', positions);
                }
            } else {
                if (match.trade.dealerId === client.id) {
                    client.emit('error_message', `You have placed Order on this price!`);
                } else {
                    const dealerSocket = io.sockets.sockets.get(match.trade.dealerId);
                    if (!dealerSocket) client.emit('error_message', `This Order not exist anymore!`);
                    tradeOptions.dealerId = client.id;
                    const trade = buildTrade(tradeOptions, match.trade);
                    if (!trade || trade.error || !trade.data) {
                        client.emit('error_message', trade.error || `Error with Building Trade!`);
                        return;
                    }
                    initNewChannel(client, dealerSocket, trade);
                }
            }
        })
    }
};

const buildTrade = (desiredTrade, matchedTrade) => {
    const buyer = [desiredTrade, matchedTrade].find(t => t.isBuy);
    const seller = [desiredTrade, matchedTrade].find(t => !t.isBuy);
    if (
        desiredTrade.propIdDesired !== matchedTrade.propIdForSale || 
        desiredTrade.propIdForSale !== matchedTrade.propIdDesired || 
        (desiredTrade.isBuy && matchedTrade.isBuy) ||
        (!desiredTrade.isBuy && !matchedTrade.isBuy) ||
        !buyer
    ) {
        return { error: 'Error witch maching order !' };
    }
    const price = matchedTrade.price;
    const amount = matchedTrade.amount;
    const propIdDesired = buyer.propIdDesired;
    const propIdForSale = buyer.propIdForSale;
    const buyerAddress = buyer.address;
    const buyerPubKey = buyer.pubKey;
    const buyerSocketId = buyer.dealerId;
    const sellerAddress = seller.address;
    const sellerPubKey = seller.pubKey;
    const sellerSocketId = seller.dealerId;
    const trade = { 
        price, amount, propIdDesired, propIdForSale, 
        buyerAddress, buyerPubKey, buyerSocketId,
        sellerAddress, sellerPubKey, sellerSocketId,
    };
    return { data: trade };
}

const initNewChannel = (client, dealer, trade) => {
    const channel = new ChannelSwap(client, dealer, trade);
}

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