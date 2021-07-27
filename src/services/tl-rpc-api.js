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

api.sendToAddress = async (address, amount) =>
    await asyncClient('sendtoaddress', address, amount);

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