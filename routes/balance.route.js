const express = require('express');
const balanceRouter = express.Router();

const sochainApi = require('../services').sochainApi;
const tlApi = require('../services').tlApi;

balanceRouter.get('/getAvailableBalance', async (req, res) => {
    try {

    const countEquity = (data) => {
        const { confirmed_balance, unconfirmed_balance, tokens } = data;
        const list = tokens.map(token => {
            const balance = parseFloat(token.balance);
            const reserve =  parseFloat(token.reserve);
            const multyplier = 1;
            const sum = (balance + reserve) * multyplier;
            return sum
        });
        const toknesEquity = list.reduce((acc, val) => acc + val, 0);
        const result = toknesEquity + parseFloat(confirmed_balance) + parseFloat(unconfirmed_balance);
        return result;
    };

    const addresses = req.query.addresses;
    if (!addresses || !addresses.length) res({error: `No provided Addresses`});

    const result = [];
    for (let i=0; i < addresses.length; i++) {
        const address = addresses[i];
        const gabRes = await sochainApi.getAddressBalance(address);
        const gtRes = await tlApi.tl_getallbalancesforaddress(address);
        if (gabRes.status === 'success') {
            gabRes.data.tokens = gtRes.data || [];
            gabRes.data.equity = countEquity(gabRes.data);
            result.push(gabRes.data);
        }
    }

    const sumTokens = [];
    result.map(r => r.tokens).forEach(st => {
      st.forEach(t => {
        const existed = sumTokens.find(e => e.propertyid === t.propertyid);
        if (existed) {
          const { balance, reserve, sum } = t;
          existed.balance += balance;
          existed.reserve += reserve;
          existed.sum += sum;
        } else {
          sumTokens.push(t);
        }
      })
    })

    result.push({
        address: 'sum',
        confirmed_balance: result.map(_ => parseFloat(_.confirmed_balance)).reduce((acc, val) => acc + val, 0),
        unconfirmed_balance: result.map(_ => parseFloat(_.unconfirmed_balance)).reduce((acc, val) => acc + val, 0),
        equity: result.map(_ => _.equity).reduce((acc, val) => acc + val, 0),
        tokens: sumTokens
    });
    res.send({ data: result });
    } catch(error) {
      console.log(error.message);
      res.send({error: error.message});
    }
});

module.exports = balanceRouter;