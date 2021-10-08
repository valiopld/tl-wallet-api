const express = require('express');
const marketRouter = express.Router();
const marketsService = require('../services/markets');

marketRouter.get('/listMarkets', (req,res) => {
    const markets = marketsService.getAvailableSpotMarkets();
    res.send({ data: markets });
});

marketRouter.get('/listFuturesMarkets', (req,res) => {
    const markets = marketsService.getAvailableFuturesMarkets();
    res.send({ data: markets });
});

module.exports = marketRouter;