const dbActions = require('../db/actions');
const channelManager = {};

channelManager.getCounterparties = (onlineFilter, cb) => {
    dbActions.counterpartiesActions.getCounterparties((res) => {
        const { data, error } = res;
        if (error || !data) return cb({ error: error });
        return cb({ data: onlineFilter ? data.filter(c => c.online) : data });
    })
};

channelManager.addCounterparty = async (couterparty) => {
    dbActions.counterpartiesActions.addCoutnerparty(couterparty, (res) => {
        const { data, error } = res;
        if (error || !data) return console.log(error.message);
        console.log(`New Counterparty Added to DB! _id: ${data._id}`);
    })
};

channelManager.disconnectCounterperty = async (counterparty) => {
    dbActions.counterpartiesActions.disconnectCounterparty({ ip: counterparty }, (res) => {
        const { data, error } = res;
        if (error || !data) return console.log(error.message);
        console.log(`Counterparty Disconnected!`);
    })
};

channelManager.findCounterpartyByAddress = async (address) => {
    return await dbActions.counterpartiesActions.getCounterpartyByAddress(address);
}

channelManager.getChannels = async (address) => {
    return await dbActions.channelsActions.getChannel(address);
};

channelManager.addChannel = async (channel) => {
    return await dbActions.channelsActions.addChannel(channel);
};

channelManager.getTxInventory = () => {
    // get All Txs
};

channelManager.addTxToInvetory = (tx) => {
    //Add tx to Inventory
};

module.exports = channelManager;