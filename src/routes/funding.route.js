const api = require('../services/tl-rpc-api');
const express = require('express');
const fundingRouter = express.Router();

fundingRouter.get('/address', async (req, res) => {
    const { address } = req.query;
    try {
        const result = await api.sendToAddress(address, 0.25);
        if (result.error || !result.data) {
            res.send({error: `Error with funding ${address}`});
        } else {
            res.send({data: `${address} is funded with: 0.25 tLTC`});
        }
    } catch (err) {
        res.send({error: `Error with funding ${address}`});
    }
});

module.exports = fundingRouter;