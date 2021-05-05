const express = require('express');
const tradeRouter = express.Router();

tradeRouter.get('/newTrade', async (req, res) => {
    try {
        const { type, info } = req.query;
        console.log({type, info});
    } catch(error) {
        res.send({ error: error.message });
    }
});


tradeRouter.get('/submitIoI', async (req, res) => {
    try {
        console.log('Submit IoI')
    } catch(error) {
        res.send({ error: error.message });
    }
});

tradeRouter.get('/cancleIoI', async (req, res) => {
    try {
        console.log('Cancle IoI')
    } catch(error) {
        res.send({ error: error.message });
    }
});

tradeRouter.get('/submitTrade', async (req, res) => {
    try {
        console.log('Submit Trade')
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