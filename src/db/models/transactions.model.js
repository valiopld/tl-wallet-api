const mongoose = require('mongoose');

const transaction = new mongoose.Schema({
    rawString: {
        type: String,
        require: true,
    },
    status: {
        type: Number,
        required: true,
        default: 1,
    },
    type: {
        type: Number,
        required: true,
    },
    propForSale: {
        type: Number,
        required: true,
    },
    amountForSale: {
        type: String,
        required: true,
    },
    propDesired: {
        type: Number,
        required: true,
    },
    amountDesired: {
        type: String,
        required: true,
    },
});

const transactionModel = mongoose.model('transaction', transaction);

module.exports = transactionModel;