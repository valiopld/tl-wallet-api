require('dotenv').config();

const config = {
    SERVER_PORT: process.env.SERVER_PORT,
    SOCKET_PORT: process.env.SOCKET_PORT,
    RPC_USER: process.env.RPC_USER,
    RPC_PASS: process.env.RPC_PASS,
    RPC_HOST: process.env.RPC_HOST,
    RPC_PORT: process.env.RPC_PORT,
    NETWORK: process.env.NETWORK || "LTCTEST",
    socketIoConfig: {
        cors: {
          origin: "*",
          methods: ["GET", "POST"]
        }
      },
};

module.exports = config;