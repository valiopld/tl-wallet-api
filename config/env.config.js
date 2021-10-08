require('dotenv').config();
const socketIoConfig = {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
};
const config = {
  SERVER_PORT: process.env.SERVER_PORT || 3002,
  SOCKET_PORT: process.env.SOCKET_PORT || 75,
  NETWORK: process.env.NETWORK || "LTCTEST",

  RPC_USER: process.env.RPC_USER,
  RPC_PASS: process.env.RPC_PASS,
  RPC_HOST: process.env.RPC_HOST,
  RPC_PORT: process.env.RPC_PORT,

  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  socketIoConfig,
};

module.exports = config;