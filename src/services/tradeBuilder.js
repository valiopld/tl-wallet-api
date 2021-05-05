const tradeTypes = {
    LTC_INSTANT: "LTC_INSTANT",
    TOKEN_TOKEN: "TOKEN_TOKEN",
};

const tradeBuilder = {};

const buildTokenTokenTrade = async (tradeInfo) => {
    console.log('Building Token Token Trade!');
    return {};
};

const buildLtcInstantTrade = async (tradeInfo) => {
    console.log('Building LTC Instant Trade !');
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