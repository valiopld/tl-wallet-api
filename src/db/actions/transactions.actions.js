const mongoose = require('mongoose');
const { transactionModel } = require('../models');

const txsActions = {};

txsActions.addCoutnerparty = async (tx, cb) => {
    try {
        const query = tx;
        const update = { };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const newTx = await transactionModel.findOneAndUpdate(query, update, options);
        cb({ data: newTx});
    } catch (error) {
        cb({ error: error.message });
    }
};

txsActions.getCounterparties = async (cb) => {
    try {
        const txs = await transactionModel.find();
        cb({ data: txs });
    } catch (error) {
        cb({ error: error.message });
    }
};

module.exports = txsActions;