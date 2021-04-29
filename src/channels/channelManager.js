const dbActions = require('../db/actions');
const channelManager = {};

channelManager.getCounterparties = () => {
    dbActions.getCounterparties((res) => {
        const { data, error } = res;
        if (error || !data) return console.log(error.message);
        console.log(data);
    })
};

channelManager.addCounterparty = async (couterparty) => {
    dbActions.addCoutnerparty({ ip: couterparty }, (res) => {
        const { data, error } = res;
        if (error || !data) return console.log(error.message);
        console.log(`New Counterparty Added to DB! _id: ${data._id}`);
    })
};

channelManager.getChannels = () => {
    // get All Channels
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