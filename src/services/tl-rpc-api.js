const litecoin = require('../../config/litecoin.config');

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

api.addmultisigaddress = async (n, pubkeysArray) =>
    await asyncClient("addmultisigaddress", n, pubkeysArray);

api.validateAddress = async (address) =>
    await asyncClient("validateaddress", address);

const checkConenction = async () => {
    const tlgiRes = await asyncClient('tl_getinfo');
    const { error } = tlgiRes;
    const message = error
        ? `There is problem with LTC node connection !`
        : `Connected to the LTC node !`;
    console.log(message);
};

checkConenction();

module.exports = api;