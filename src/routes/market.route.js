const express = require('express');
const marketRouter = express.Router();

class MarketType {
    constructor(name, markets, icon, disabled) {
        this.name = name;
        this.markets = markets;
        this.icon = icon;
        this.disabled = disabled;
    }
}

class Market {
    constructor(first_token, second_token, disabled = false) {
        this.first_token = first_token;
        this.second_token = second_token;
        this.disabled = disabled;
        this.pairString = `${this.first_token.shortName}/${this.second_token.shortName}`
    }
}

class Token {
    constructor(shortName, fullName, propertyId) {
        this.shortName = shortName;
        this.fullName = fullName;
        this.propertyId = propertyId;
    }
}

const allToken = new Token('ALL', 'ALL', 1);
const ltcToken = new Token('LTC', 'LTC', 999);

const woodenToken = new Token('WDN', 'Wooden Token', 4);
const goldToken = new Token('GLD', 'Gold Token', 5);
const lihkiToken = new Token('LHK', 'Lihki Token', 6);
const testToken1 = new Token('TT1', 'Test Token 1', 7);
const testToken2 = new Token('TT2', 'Testo Token 2', 8);
const danToken = new Token('DAN', 'Dan Token', 9 );
const wBtcToken = new Token('WBTC', 'Wrapped BTC', 10);
const wEthToken = new Token('WETH', 'Wrapped ETH', 11);

const getAvailableMarkets = () => {
    const ltcIcon = 'https://bitcoin-capital.bg/wp-content/uploads/2019/07/1920px-LTC-400-min-300x300.png';
    const usdIcon = 'https://cdn0.iconfinder.com/data/icons/mobile-device/512/dollar-usd-round-keyboard-money-usa-latin-2-512.png';
    const allIcon = 'https://cdn.discordapp.com/attachments/749975407838888058/817037799739490344/ALLFancyLogo.png';
    const ltcMartkets = [
        // new Market(woodenToken, ltcToken),
        // new Market(goldToken, ltcToken),
        // new Market(lihkiToken, ltcToken),
        // new Market(testToken1, ltcToken),
        // new Market(testToken2, ltcToken),
        // new Market(danToken, ltcToken),
        new Market(wBtcToken, ltcToken),
        new Market(wEthToken, ltcToken),
    ];

    const usdMarkets = [];
    const allMarkets = [
        new Market(woodenToken, allToken),
        new Market(goldToken, allToken),
        new Market(lihkiToken, allToken),
        new Market(testToken1, allToken),
        new Market(testToken2, allToken),
        new Market(danToken, allToken),
    ];

    const ltcMarketType = new MarketType('LTC', ltcMartkets, ltcIcon);
    const usdMarketType = new MarketType('USD', usdMarkets, usdIcon, true);
    const allMarketType = new MarketType('ALL', allMarkets, allIcon, true);
    return [ ltcMarketType, usdMarketType, allMarketType ];
}

marketRouter.get('/listMarkets', (req,res) => {
    const markets = getAvailableMarkets();
    res.send({ data: markets });
});

module.exports = marketRouter;