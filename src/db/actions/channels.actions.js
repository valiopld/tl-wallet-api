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

channelsActions.getCounterparties = async (cb) => {
    try {
        const channels = await channelModel.find();
        cb({ data: channels });
    } catch (error) {
        cb({ error: error.message });
    }
};

module.exports = channelsActions;