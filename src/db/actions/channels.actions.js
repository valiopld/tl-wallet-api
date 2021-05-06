const mongoose = require('mongoose');
const { channelModel } = require('../models');

const channelsActions = {};

channelsActions.addChannel = async (channel, cb) => {
    try {
        const query = channel;
        const update = { };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const newChannel = await channelModel.findOneAndUpdate(query, update, options);
        cb({ data: newChannel});
    } catch (error) {
        cb({ error: error.message });
    }
};

channelsActions.getChannel = async (address, cb) => {
    try {
        const query = [ { 'address1': address }, { 'address2': address } ];
        const channels = await channelModel.findOne().or(query);
        return { data: channel };
    } catch (error) {
        return { error: error.message };
    }
};

module.exports = channelsActions;