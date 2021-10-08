const api = require('../services/tl-rpc-api');
const express = require('express');
const fundingRouter = express.Router();
const config = require('../../config');

fundingRouter.get('/address', async (req, res) => {
    if (config.NETWORK !== "LTCTEST") {
        res.send({ error: `Funding is available only in TESTNET `});
        return;
    }
    const { address } = req.query;
    try {
        const result = await api.sendToAddress(address, 1);
        if (result.error || !result.data) {
            res.send({error: `Error with funding ${address}`});
        } else {
            res.send({data: `${address} is funded with: 1 tLTC`});
        }
    } catch (err) {
        res.send({error: `Error with funding ${address}`});
    }
});

module.exports = fundingRouter;