const litecoin = require('../config/litecoin.config');

const asyncClient = async (...args) => 
(await new Promise((resolve, reject) => {
    try {
        litecoin.cmd(...args, (error, data) => {
            const result = { error: null, data: null }
            if (error) result.error = error.message
            if (data) result.data = data
            resolve(result);
        })
    } catch (error) {
        reject(error)
    }
}));

const api = {};

api.tl_getallbalancesforaddress = async (address) =>
    await asyncClient('tl_getallbalancesforaddress', address);

module.exports = api;