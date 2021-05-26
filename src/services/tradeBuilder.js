const channelManager = require('../channels/channelManager');
const tlApi = require('../services/tl-rpc-api');
const socket = require('socket.io-client');
const sochainApi = require('../services/sochain-api');
const tradeTypes = {
    LTC_INSTANT: "LTC_INSTANT",
    TOKEN_TOKEN: "TOKEN_TOKEN",
};

const tradeBuilder = {};

const findNewDealer = async (tradeInfo) => {
    return new Promise((res, rej) => {
        channelManager.getCounterparties(true, (result) => {
            const { error, data } = result;
            if (error || !data ) return rej({ error });
            res(data[0]);
        })
    })
};

const findOrCreateChannel = async (tradeInfo) => {
    const { address, publicKey } = JSON.parse(tradeInfo.address);
    const existingChannel = await channelManager.getChannels(address);
    const channelResError = existingChannel.error;
    const channelResData = existingChannel.data;
    if (!channelResError && channelResData) {
        console.log(`Existing Channel for this addreses Found!`);
        return channelResData
    } else {
        console.log(`Not found existing Chnnale. Crating new One!`);
        const pubkey1 = publicKey
        
        const dealer = await findNewDealer(tradeInfo);
        const pubkey2 = dealer.addressObj.publicKey;
        const pubKeysArray = [ pubkey1, pubkey2 ];
        const multisigAddressRes = await tlApi.addmultisigaddress(2, pubKeysArray);
        const msaData = multisigAddressRes.data;
        const msaError = multisigAddressRes.error;
        if (!msaData || msaError ) return;
        const channelObj = {
            multisig: msaData,
            address1: address,
            address2: dealer.addressObj.address,
        };
        const addedChannel = await channelManager.addChannel(channelObj);
        if (!addedChannel.data || addedChannel.error) return;
        return addedChannel.data;
    }
};

const getDealerByAddress = async (address) => {
    const dealerRes = await channelManager.findCounterpartyByAddress(address);
    if (dealerRes.error || !dealerRes.data) return;
    const dealer = dealerRes.data;
    return dealer
};

const askTheDealerToCommit = async (commitOpt, io) => {
    io.emit('commit', commitOpt);
    return new Promise((res, rej) => {
        io.on('commitRes', (result) => {
            res(result)
        })
    });
};

const openTradeSocketConenctionWithTheDealer = async (dealer) => {
    const { ip, port } = dealer;
    const host = `http://${ip}:${port}`;
    const io = socket.io(host);
    return io;
};

const getMinimumUtxos = async (address, minimumValue) => {
    const utxosRes = await sochainApi.getUtxos(address);
    if (utxosRes.status !== 'success' || !utxosRes.data) return [];
    const utxos = utxosRes.data.txs;
    const sortedArray = utxos.sort((a, b) => a.value - b.value );
    const minimumArray = [];
    sortedArray.forEach(u => {
        const n = minimumArray.map(u2 => u2.value).reduce((acc, val) => acc + val, 0);
        if (n < minimumValue) minimumArray.push(u);
    });
    return minimumArray.map(utxo => ({txid: utxo.txid, vout: utxo.output_no, value: utxo.value, scriptPubKey: utxo.script_hex}));
};

const buildRawCommitTx = async (tradeInfo, multisigAddress) => {
    const { address } = JSON.parse(tradeInfo.address);
    const { tokenForSale, amountForSale } = tradeInfo;
    const payloadRes = await tlApi.tl_createpayload_commit_tochannel(parseInt(tokenForSale), amountForSale);
    const payloadData = payloadRes.data;
    const payloadError= payloadRes.error;
    if (payloadError || !payloadData ) return console.error('Error with Creating Payload')
    const vins = await getMinimumUtxos(address, 0.0035);
    const commitRawTx = await tlApi.buildRawTx(vins, payloadData, address, multisigAddress);
    return commitRawTx;
};

const getTxIdFromRawTx = async (rawTx) => {
    const decodedTxRes = await tlApi.decoderawtransaction(rawTx);
    const { data, error } = decodedTxRes;
    if (!data || error ) return console.log(error || 'Error with Decoding Raw TX');
    return data.txid;
};

const buildTokenTokenTrade = async (tradeInfo) => {
    console.log('Building Token Token Trade!');
    const selectedChannel = await findOrCreateChannel(tradeInfo);
    const dealer = await getDealerByAddress(selectedChannel.address2)

    const commitOpt = {
        amount: tradeInfo.amountDesired,
        token: tradeInfo.tokenDesired,
        channel: selectedChannel.multisigAddress,
    };
    
    const dealerIoConnection = await openTradeSocketConenctionWithTheDealer(dealer);

    const clientCommitRawTx = await buildRawCommitTx(tradeInfo, selectedChannel.multisigAddress);
    const clientCommitTx = await getTxIdFromRawTx(clientCommitRawTx);

    const dealerCommitRes = await askTheDealerToCommit(commitOpt, dealerIoConnection);
    const dcData = dealerCommitRes.data;
    const dcError = dealerCommitRes.error;
    if (!dcData || dcError) return console.log(dcError);

    const dealerCommitTx = dcData;
    console.log({clientCommitTx, dealerCommitTx});

    const vins = await getMinimumUtxos(selectedChannel.multisigAddress, 0.1);
    const expBlockRes = await tlApi.getBestBlock();
    const expBlockData = expBlockRes.data.height
    const expBlockError = expBlockRes.error;

    if (expBlockError || !expBlockData) return console.log(expBlockError || "Error with Getting Best Block");

    const addBlocks = 5;
    const expBlock = expBlockData + addBlocks;

    const payloadOpt = [
        parseInt(tradeInfo.tokenForSale),
        tradeInfo.amountForSale,
        parseInt(tradeInfo.tokenDesired),
        tradeInfo.amountDesired,
        expBlock,
    ];
    const payloadRes = await tlApi.tl_createpayload_instant_trade(...payloadOpt);
    const payloadData = payloadRes.data;
    const payloadError= payloadRes.error;
    const { address } = JSON.parse(tradeInfo.address);
    const firstAddress = address;
    const secondAddress = dealer.addressObj.address;
    const rawTx = await tlApi.buildRawTx(vins, payloadData, firstAddress, secondAddress);
    console.log(rawTx);
    return { rawTx, clientCommitRawTx }
};

const buildLtcInstantTrade = async (tradeInfo) => {
    console.log('Building LTC Instant Trade !');
    console.log(tradeInfo);
    return {};
};

tradeBuilder.build = async (tradeInfo) => {
    const { type } = tradeInfo;
    
    switch (type) {
        case tradeTypes.LTC_INSTANT:
            return await buildLtcInstantTrade(tradeInfo);
        case tradeTypes.TOKEN_TOKEN:
            return await buildTokenTokenTrade(tradeInfo);
        default:
            return { error: 'No matched Trade Type'};
    }
};

module.exports = tradeBuilder;