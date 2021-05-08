const mongoose = require('mongoose');
const { channelModel } = require('../models');

const channelsActions = {};

channelsActions.addChannel = async (channel, cb) => {
    try {
        const query = {
            multisigAddress: channel.multisig.address,
            redeemScript: channel.multisig.redeemScript,
            address1: channel.address1,
            address2: channel.address2,
        };
        const update = {};
        const options = { upsert: true, new: true, setDefaultsOnInsert: true , useFindAndModify: false };
        const newChannel = await channelModel.findOneAndUpdate(query, update, options);
        return { data: newChannel };
    } catch (error) {
        return { error: error.message }
    }
};

channelsActions.getChannel = async (address, cb) => {
    try {
        const query = [ { 'address1': address }, { 'address2': address } ];
        const channel = await channelModel.findOne().or(query);
        return { data: channel };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = channelsActions;