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
    dbActions.counterpartiesActions.addCoutnerparty({ ip: couterparty }, (res) => {
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

channelManager.getChannels = async (address) => {
    return await dbActions.channelsActions.getChannel(address);
};

channelManager.addChannel = (channel) => {
    // Add Channel
};

channelManager.getTxInventory = () => {
    // get All Txs
};

channelManager.addTxToInvetory = (tx) => {
    //Add tx to Inventory
};

module.exports = channelManager;