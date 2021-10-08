
class SpotMarketType {
    constructor(name, markets, icon, disabled) {
        this.name = name;
        this.markets = markets;
        this.icon = icon;
        this.disabled = disabled;
    }
}

class FuturesMarketType {
    constructor(name, contracts, icon, disabled) {
        this.name = name;
        this.contracts = contracts;
        this.icon = icon;
        this.disabled = disabled;
    }
}

class Contract {
    constructor(contractId, contractName, first_token, second_token, disabled = false) {
        this.contractId = contractId;
        this.contractName = contractName;
        this.first_token = first_token;
        this.second_token = second_token;
        this.disabled = disabled;
        this.pairString = `${this.first_token.shortName}/${this.second_token.shortName}`
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
const ltcToken = new Token('LTC', 'LTC', -1);

const wBtcToken = new Token('WBTC', 'Wrapped BTC', 4);
const wEthToken = new Token('WETH', 'Wrapped ETH', 5);

const btcContractPart = new Token('BTC', 'bitcoin', 0);
const usdContractPart = new Token('USD', 'United State Dollar', 0);

const ltcIcon = 'https://bitcoin-capital.bg/wp-content/uploads/2019/07/1920px-LTC-400-min-300x300.png';
const usdIcon = 'https://cdn0.iconfinder.com/data/icons/mobile-device/512/dollar-usd-round-keyboard-money-usa-latin-2-512.png';
const allIcon = 'https://cdn.discordapp.com/attachments/749975407838888058/817037799739490344/ALLFancyLogo.png';
const btcIcon = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/BTC_Logo.svg/2000px-BTC_Logo.svg.png';
const dogeIcon = 'https://logos-download.com/wp-content/uploads/2018/04/DogeCoin_logo_cercle-700x700.png';

const getAvailableSpotMarkets = () => {
    const ltcMartkets = [
        new Market(wBtcToken, ltcToken),
        new Market(wEthToken, ltcToken),
    ];

    const usdMarkets = [];
    const allMarkets = [
        new Market(wBtcToken, wEthToken),
        // new Market(wEthToken, wBtcToken),
    ];

    const ltcMarketType = new SpotMarketType('LTC', ltcMartkets, ltcIcon);
    const usdMarketType = new SpotMarketType('USD', usdMarkets, usdIcon, true);
    const allMarketType = new SpotMarketType('ALL', allMarkets, allIcon, true);
    return [ ltcMarketType, usdMarketType, allMarketType ];
}

const getAvailableFuturesMarkets = () => {

    const ltcContracts = [
        new Contract(3, 'testbtcusd', btcContractPart, usdContractPart),
        new Contract(1, 'btcusd', usdContractPart, btcContractPart),
    ];
    const btcContracts = [
    ];
    const dogeContracts = [];
 
    const ltcMarketType = new FuturesMarketType('LTC', ltcContracts, ltcIcon);
    const btcMarketType = new FuturesMarketType('BTC', btcContracts, btcIcon, true);
    const dogeMarketType = new FuturesMarketType('DOGE', dogeContracts, dogeIcon, true);
    return [ ltcMarketType, btcMarketType, dogeMarketType ];
};

module.exports = {
    getAvailableSpotMarkets,
    getAvailableFuturesMarkets,
}