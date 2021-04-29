const mongoose = require('mongoose');
const counterpartyModel = require('./couterparty.model');
const transactionModel = require('./transactions.model');
const channelModel = require('./channel.model');

module.exports = {
    counterpartyModel,
    transactionModel,
    channelModel,
}