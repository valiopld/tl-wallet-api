const litecoin = require('litecoin');
const config = require('./env.config');

const client = new litecoin.Client({
    host: config.RPC_HOST,
    port: config.TLPORT,
    user: config.RPC_USER,
    pass: config.RPC_PASS,
    ssl: false/* true, */
  });

  // user: "pepejandro",
  // pass: "pepecash",
  
  module.exports = client;