const channelManager = require('../channels/channelManager');
const tlApi = require('../services/tl-rpc-api');

const tradeTypes = {
    LTC_INSTANT: "LTC_INSTANT",
    TOKEN_TOKEN: "TOKEN_TOKEN",
};

const tradeBuilder = {};
const getPubKey = async (address) => {
    const vaRes = await tlApi.validateAddress(address);
    const { data, error } = vaRes;
    if (error || !data || !data.scriptPubKey ) return { error };
    return data.scriptPubKey;
};

const findOrCreateChannel = async (address) => {
    const existingChannel = await channelManager.getChannels(address);
    const channelResError = existingChannel.error;
    const channelResData = existingChannel.data;
    if (!channelResError && channelResData) {
        console.log(`Existing Channel for this addreses Found!`);
        console.log(channelResData);
    } else {
        console.log(`Not found existing Chnnale. Crating new One!`);
        const address2 = 'QMjCWx6G85V89PYcb3msyyQvbp2RxCprEy';

        const pubkey1 = await getPubKey(address);
        const pubkey2 = await getPubKey(address2);
        const pubKeysArray = [ pubkey1, pubkey2 ];
        console.log(pubKeysArray)
        const multisigAddress = await tlApi.addmultisigaddress(2, pubKeysArray);
        console.log({multisigAddress});
    }
}

const buildTokenTokenTrade = async (tradeInfo) => {
    console.log('Building Token Token Trade!');
    const { address } = tradeInfo;
    const channel = await findOrCreateChannel(address);
    console.log(channel);
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