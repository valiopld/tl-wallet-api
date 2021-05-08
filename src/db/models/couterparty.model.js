const mongoose = require('mongoose');

const AddressObjSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    publicKey: {
        type: String,
        required: true,
    },
});

const counterpartySchema = new mongoose.Schema({
    ip: {
        type: String,
        require: true,
    },
    avgSignBackTime: {
        type: Number,
        required: true,
        default: 0,
    },
    cancelRate: {
        type: Number,
        required: true,
        default: 0,
    },
    KYC: {
        type: [Number],
        reqyured: true,
        default: [],
    },
    alias: {
        type: String,
        required: false,
    },
    online: {
        type: Boolean,
        required: true,
        default: true,
    },
    lastConnection: {
        type: Date,
        required: true,
        default: Date.now,
    },
    addressObj: {
        type: AddressObjSchema,
        required: true,
    },
    port: {
        type: Number,
        required: true,
    }
});

const counterpartyModel = mongoose.model('counterparty', counterpartySchema);

module.exports = counterpartyModel;