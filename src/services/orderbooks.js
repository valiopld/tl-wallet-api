const allDataByDealers = {};

const addToDealersData = (ip, addressPair, tradesData) => {
    if (!allDataByDealers[ip]) allDataByDealers[ip] = [];
    const { address, pubkey } = addressPair;
    const existing = allDataByDealers[ip].find(aObj => aObj.address === address && aObj.pubkey === pubkey);
    existing
        ? existing.tradesData = tradesData
        : allDataByDealers[ip] = [...allDataByDealers[ip], { address, pubkey, tradesData } ];
}

const clearOrderbooksFromIp = (ip) => {
    allDataByDealers[ip] = [];
};

module.exports = {
    allDataByDealers, 
    addToDealersData,
    clearOrderbooksFromIp,
}