let allDataByDealers = [];

const addToDealersData = (ip, addressPair, tradesData) => {
    const { address, pubkey } = addressPair;
    clearOrderbooksbyPubkey(pubkey);
    tradesData.forEach(trade => allDataByDealers.push({ ...trade, conn: { ip, address, pubkey } }));
}

const addToDealersData2 = (dealerId, trade) => {
    const { price, amount, propIdForSale, propIdDesired, isBuy, address, pubKey, marketName } = trade;
    if (!dealerId || !price || !amount || !propIdForSale || !propIdDesired || !address || !pubKey || !marketName)  {
        return { error: `Missing Properties` };
    } else {
        const existing = allDataByDealers.find(d => (
                d.dealerId === dealerId && 
                d.price === price && 
                d.propIdForSale === propIdForSale && 
                d.propIdDesired === propIdDesired &&
                d.isBuy === isBuy &&
                d.address === address &&
                d.pubKey === pubKey &&
                d.marketName === marketName
            ));

        existing
            ? existing.amount = parseFloat((existing.amount + trade.amount).toFixed(5))
            : allDataByDealers.push({dealerId, ...trade});
        
        return existing ? { data: existing } : { data: {dealerId, ...trade} };
    }
}

const clearOrderbooksBySocketId = (dealerId) => {
    allDataByDealers = allDataByDealers.filter(trade => trade.dealerId !== dealerId);
}

const clearOrderbookByAddressAndId = (dealerId, address) => {
    allDataByDealers = allDataByDealers.filter(trade => !(trade.dealerId === dealerId && trade.address === address));
}

const clearOrderbooksbyPubkey = (pubkey) => {
    allDataByDealers = allDataByDealers.filter(trade => trade.conn.pubkey !== pubkey);
}

const clearOrderbooksFromIp = (ip) => {
    allDataByDealers = allDataByDealers.filter(trade => trade.conn.ip !== ip);
};

const findDealerByTrade = (trade, dealerId) => {
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
        const _goodTrade = arrayOfTrades[0];
        const goodTrade = _goodTrade.amount <= amount
            ? _goodTrade
            : {..._goodTrade, amount: amount };
        const unfilled = amount > goodTrade.amount
            ? { ...trade, amount: parseFloat((amount - goodTrade.amount).toFixed(5)) }
            : null;

        const _t = allDataByDealers.find(t => JSON.stringify(t) === JSON.stringify(_goodTrade));
        if (_t && _t.dealerId !== dealerId) {
            _goodTrade.amount <= amount
                ? allDataByDealers = allDataByDealers.filter(t => t !== _t)
                : _goodTrade.amount = parseFloat((_goodTrade.amount - amount).toFixed(5));
        }
        const res = { trade: goodTrade, unfilled };
        return res;
    }
    return null
};

const getTradesById = (dealerId) => {
    return allDataByDealers.filter(d => d.dealerId === dealerId);
}

const getAllDealersData = () => {
    return allDataByDealers;
};

const closePosition = (position) => {
    const pos = allDataByDealers.find(d => JSON.stringify(d) === JSON.stringify(position));
    allDataByDealers = allDataByDealers.filter(d => d !== pos);
};

module.exports = {
    allDataByDealers, 
    addToDealersData,
    clearOrderbooksFromIp,
    findDealerByTrade,
    getAllDealersData,
    addToDealersData2,
    getTradesById,
    clearOrderbooksBySocketId,
    closePosition,
    clearOrderbookByAddressAndId,
}