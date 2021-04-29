const mongoose = require('mongoose');

const channel = new mongoose.Schema({
    multisigAddress: {
        type: String,
        require: true,
    },
    address1: {
        type: String,
        require: true,
    },
    address2: {
        type: String,
        require: true,
    },
});

const channelModel = mongoose.model('channel', channel);

module.exports = channelModel;