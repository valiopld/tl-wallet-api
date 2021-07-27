let allDataByDealers = [];

const addToDealersData = (ip, addressPair, tradesData) => {
    const { address, pubkey } = addressPair;
    clearOrderbooksbyPubkey(pubkey);
    tradesData.forEach(trade => allDataByDealers.push({ ...trade, conn: { ip, address, pubkey } }));
}

const clearOrderbooksbyPubkey = (pubkey) => {
    allDataByDealers = allDataByDealers.filter(trade => trade.conn.pubkey !== pubkey);
}
const clearOrderbooksFromIp = (ip) => {
    allDataByDealers = allDataByDealers.filter(trade => trade.conn.ip !== ip);
};

const findDealerByTrade = (trade) => {
    const { propIdForSale, propIdDesired, amount, price, isBuy } = trade;
    const sortFunc = isBuy
        ? (a, b) => a.price - b.price
        : (a, b) => b.price - a.price;
    const arrayOfTrades = allDataByDealers.filter(t => (
            t.propIdForSale === propIdDesired && 
            t.propIdDesired === propIdForSale &&
            (isBuy ? t.price <= price : t.price >= price) &&
            isBuy === !t.isBuy
    )).sort(sortFunc);

    if (arrayOfTrades.length) {
        const goodTrade = arrayOfTrades[0];
        const dealer = goodTrade;
        const unfilled = amount > goodTrade.amount
            ? { ...trade, amount: amount - goodTrade.amount }
            : null;
        const res = { dealer, unfilled };
        return res;
    }
    return null
};


const getAllDealersData = () => {
    return allDataByDealers;
};

module.exports = {
    allDataByDealers, 
    addToDealersData,
    clearOrderbooksFromIp,
    findDealerByTrade,
    getAllDealersData,
}