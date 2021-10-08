const express = require('express');
const { tradeBuilder } = require('../services');
const { findDealerByTrade } = require('../services/orderbooks');
const tradeRouter = express.Router();

tradeRouter.get('/getDealer', async (req, res) => {
    try {
        const trade = JSON.parse(req.query.trade);
        if (!trade) res.send({error: 'No request Provided'});
        const dealer = findDealerByTrade(trade);
        res.send({ data: dealer });
    } catch(error) {
        res.send({ error: error.message });
    }
});

tradeRouter.get('/newTrade', async (req, res) => {
    try {
        const { type, info } = req.query;
        console.log({type, info});
    } catch(error) {
        res.send({ error: error.message });
    }
});

tradeRouter.get('/cancleTrade', async (req, res) => {
    try {
        console.log('Cancle Trade')
    } catch(error) {
        res.send({ error: error.message });
    }
});

tradeRouter.get('/closeChannel', async (req, res) => {
    try {
        console.log('Close Channel')
    } catch(error) {
        res.send({ error: error.message });
    }
});

module.exports = tradeRouter;