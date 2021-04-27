const balanceRouter = require('./balance.route');

const configureRoutes = app => {
    app.use('/balance', balanceRouter);
    // app.use('/api/properties', propertyRouter)
    // app.use('/api/orderbooks', orderbookRouter)
    // app.use('/api/txn', txnRouter)
    // app.use('/api/positions', positionRouter)
    // app.use('/api/dcurrency', dcurrencyApi)
    // app.use('/api/blocklist', blocklistRouter);
    // app.use('/api/block-transactions', blockTransactionsRouter);
    // app.use('/api/address', addressRouter);
    // app.use('/api/system', systemRouter);
    // dcurrencyApi(app)
    // priceApi(app)
    // tradeApi(app)
    // userApi(app)
};


module.exports = {
    configureRoutes,
};