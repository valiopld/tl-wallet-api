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

module.exports = tradeRouter;