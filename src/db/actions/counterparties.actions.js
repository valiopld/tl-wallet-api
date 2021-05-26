const mongoose = require('mongoose');
const { counterpartyModel } = require('../models');

const counterpartiesActions = {};

counterpartiesActions.addCoutnerparty = async (counterparty, cb) => {
    try {
        const { addressObj, ip, port } = counterparty;
        const query = { ip };
        const update = { addressObj, port, lastConnection: new Date(), online: true };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true , useFindAndModify: false };
        const newCounterparty = await counterpartyModel.findOneAndUpdate(query, update, options);
        cb({ data: newCounterparty});
    } catch (error) {
        cb({ error: error.message });
    }
};

counterpartiesActions.getCounterparties = async (cb) => {
    try {
        const counterparties = await counterpartyModel.find();
        cb({ data: counterparties });
    } catch (error) {
        cb({ error: error.message });
    }
};

counterpartiesActions.disconnectCounterparty = async (counterparty, cb) => {
    try {
        const query = { ip: counterparty.ip };
        const update = { online: false };
        const counterpartyRes = await counterpartyModel.updateOne(query, update);
        cb({ data: counterpartyRes});
    } catch (error) {
        cb({ error: error.message });
    }
};

counterpartiesActions.getCounterpartyByAddress = async (address) => {
    try {
        const counterparty = await counterpartyModel.findOne({ 'addressObj.address': address});
        return { data: counterparty}
    } catch (error) {
        return { error: error.message };
    }
}
module.exports = counterpartiesActions;