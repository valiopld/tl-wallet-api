const mongoose = require('mongoose');
const { counterpartyModel } = require('../models');

const counterpartiesActions = {};

counterpartiesActions.addCoutnerparty = async (counterparty, cb) => {
    try {
        const query = { ip: counterparty.ip };
        const update = { lastConnection: new Date(), online: true };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
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

module.exports = counterpartiesActions;