const axios = require('axios');
const config = require('../config/env.config');

const NETWORK = config.NETWORK;
const baseURL = 'https://sochain.com/api/v2/';

const sochainApi = {};

sochainApi.getAddressBalance = async (address) => {
    if (!address) console.log('Error!');
    const url = baseURL + 'get_address_balance/' + NETWORK + '/' + address;
    const res = await axios.get(url);
    return res.data;
}

module.exports = sochainApi;