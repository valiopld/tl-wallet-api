const channelManager = require('../channels/channelManager');
const tlApi = require('../services/tl-rpc-api');

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
}

const buildTokenTokenTrade = async (tradeInfo) => {
    console.log('Building Token Token Trade!');
    const selectedChannel = await findOrCreateChannel(tradeInfo);
    console.log(selectedChannel);
    
};

const buildLtcInstantTrade = async (tradeInfo) => {
    console.log('Building LTC Instant Trade !');
    console.log(tradeInfo)
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