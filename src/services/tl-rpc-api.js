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

api.signrawtransaction = async(rawtx) =>
    await asyncClient('signrawtransaction', rawtx)

api.tl_getallbalancesforaddress = async (address) =>
    await asyncClient('tl_getallbalancesforaddress', address);

api.addmultisigaddress = async (n, pubkeysArray) =>
    await asyncClient("addmultisigaddress", n, pubkeysArray);

api.validateAddress = async (address) =>
    await asyncClient("validateaddress", address);

api.decoderawtransaction = async (rawTx) =>
    await asyncClient('decoderawtransaction', rawTx);

api.tl_createpayload_commit_tochannel = async (propId, amount) =>
    await asyncClient("tl_createpayload_commit_tochannel", propId, amount);

api.listunspent = async (min = 0, max = 9999999, channelsArray = null) =>
    await asyncClient("listunspent", min, max, channelsArray);

api.tl_createpayload_instant_trade = async (id1, amount1, id2, amount2, expiryBlockHeight) =>
    await asyncClient('tl_createpayload_instant_trade', id1, amount1, id2, amount2, expiryBlockHeight);

api.getBestBlockHash = async () =>
    await asyncClient('getbestblockhash');

api.getBlockHash = async (block) =>
    await asyncClient('getblockhash', block);

api.getBlock = async (hash) =>
    await asyncClient('getblock', hash);

api.getBestBlock = async () => {
    const bestBlockHashResult = await api.getBestBlockHash();
    const bestBlockHashError = bestBlockHashResult.error;
    const bestBlockHashData = bestBlockHashResult.data;

    return bestBlockHashError 
        ? bestBlockHashResult 
        : await api.getBlock(bestBlockHashData);
};

api.buildRawTx = async (vins, payload, firstAddress, secondAddress) => {
    if (!vins.length || !payload || !firstAddress || !secondAddress) return { error: 'Missing vins, payload or ChangeAddress' };
    const tl_createrawtx_inputAll = async () => {
        let hex = '';
        for (const vin of vins) {
            const crtxiRes = await asyncClient('tl_createrawtx_input', hex, vin.txid, vin.vout);
            if (crtxiRes.error || !crtxiRes.data) return { error: 'Error with creating raw tx' };
            hex = crtxiRes.data;
        }
        return { data: hex };
    };

    const crtxiRes = await tl_createrawtx_inputAll();
    if (crtxiRes.error || !crtxiRes.data) return { error: 'Error with creating raw tx' };

    const crtxrRes = await asyncClient('tl_createrawtx_change', crtxiRes.data, vins, firstAddress, 0.00036);
    if (crtxrRes.error || !crtxrRes.data) return { error: crtxrRes.error || 'Error with adding change address' };

    const crtxrRes2 = await asyncClient('tl_createrawtx_reference', crtxrRes.data, secondAddress);
    if (crtxrRes2.error || !crtxrRes2.data) return { error: 'Error with adding referance address' };

    const crtxoRes = await asyncClient('tl_createrawtx_opreturn', crtxrRes2.data, payload);
    if (crtxoRes.error || !crtxoRes.data) return { error: crtxoRes.error || 'Error with adding payload' };

    return crtxoRes.data;
};

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