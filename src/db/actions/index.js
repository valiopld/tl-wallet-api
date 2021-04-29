const mongoose = require('mongoose');
const models = require('../models');

const actions = {};

actions.addCoutnerparty = async (counterparty, cb) => {
    try {
        const query = { ip: counterparty.ip };
        const update = { lastConnection: new Date(), online: true };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const newCounterparty = await models.counterpartyModel.findOneAndUpdate(query, update, options);
        cb({ data: newCounterparty});
    } catch (error) {
        cb({ error: error.message });
    }
};

actions.getCounterparties = async (cb) => {
    try {
        const counterparties = await models.counterpartyModel.find();
        cb({ data: counterparties });
    } catch (error) {
        cb({ error: error.message });
    }
};

module.exports = actions;