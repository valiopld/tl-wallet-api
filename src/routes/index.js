const balanceRouter = require('./balance.route');
const tradeRouter = require('./trade.router');

const configureRoutes = app => {
    app.use('/balance', balanceRouter);
    app.use('/trade', tradeRouter);
};

module.exports = {
    configureRoutes,
};