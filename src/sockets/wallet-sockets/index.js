const channelManager = require('../../channels/channelManager');
const ltcInstantTrade = require('../../trade-builder').ltcInstantTrade;
const api = require('../../services/tl-rpc-api');

const socketOnEvents = {
    LTC_INSTANT_TRADE: 'LTC_INSTANT_TRADE',
}

const socketEmitEvents = {
    TRADE_REJECTION: 'TRADE_REJECTION',
}

const handleConnection = (client) => {
    console.log(`New Client Connected! ID: ${client.id}`);

    client.on('disconnect', () => console.log(`Client disconnected. socket ID: ${client.id}`));
    client.on(socketOnEvents.LTC_INSTANT_TRADE, (tradeConf) => handleLTCInstantTrade(tradeConf, client));
};

const handleLTCInstantTrade = async (tradeConf, client) => {
    ['MULTYSIG_DATA', 'RAW_HEX']
        .forEach((e) => client.removeAllListeners(e));
    const counterparties = await getCounterParties(tradeConf);
    if (!counterparties || !counterparties.length) {
        client.emit(socketEmitEvents.TRADE_REJECTION, 'No Counterperties Founds!');
        console.log('No Counterparties Found!')
    } else {
        const counterparty = counterparties[0];
        tradeConf.cpPubkey = counterparty.addressObj.publicKey;
        tradeConf.cpAddress = counterparty.addressObj.address;
        const counterpartyConnection = `${counterparty.ip}:${counterparty.port}`;
        ltcInstantTrade(tradeConf, client, counterpartyConnection)
    }
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
    io.on('connection', handleConnection);
    blockCounter(io)
    setInterval(() => {
        const data = { data: 'No news is a good news :)'};
        io.emit('dataFeed', data)
    }, 5000);
};

const getCounterParties = (tradeConf) => {
    return new Promise((res, rej) => {
        const counterpartiesList = channelManager.getCounterparties(true, (result) => {
            const { data, error } = result;
            if (error || !data) return console.log(error || 'There is problem with listing Counterparties');
            res(data)
        });
    });
}

module.exports = {
    connect
}