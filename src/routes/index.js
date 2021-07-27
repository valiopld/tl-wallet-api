const tradeRouter = require('./trade.router');
const marketRouter = require('./market.route');
const fundingRouter = require('./funding.route');

const configureRoutes = app => {
    app.use('/trade', tradeRouter);
    app.use('/market', marketRouter);
    app.use('/funding', fundingRouter);
};

module.exports = {
    configureRoutes,
};