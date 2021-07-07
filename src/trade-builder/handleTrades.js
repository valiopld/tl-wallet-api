const socket = require('socket.io-client');

const CP_EVENTS = {
    EMIT: {

    },
    ON: {
    }
}

const CLIENT_EVENTS =  {
    EMIT: {

    },
    ON: {

    }
}

const tokenTokenTrade = (tradeConf, clientSocket, counterpartyConnection) => {
    const cpSocket = socket.io(`http://${counterpartyConnection}`, {reconnection: false, timestampRequests: 1000});
    const { propIdDesired, propIdForSale, amountDeisred, amountForSale, clientPubKey, clientAddress } = tradeConf;
    const trade = {
        type: "TOKEN_TOKEN_TRADE",
        propIdDesired: propIdDesired,
        propIdForSale: propIdForSale,
        amountDeisred: amountDeisred,
        amountForSale: amountForSale,
        address: clientAddress,
        pubkey: clientPubKey,
    }
    cpSocket.emit('TRADE_REQUEST', trade);
    cpSocket.on('REJECT_TRADE', (reason) => {
        clientSocket.emit('TRADE_REJECTION', reason);
        console.log(`Trade Rejected! ${reason}`)
    });
    cpSocket.on('connect_error', () => {
        clientSocket.emit('TRADE_REJECTION', `Connection Fail`);
    });

    cpSocket.on('TERMINATE_TRADE', (reason) => {
        clientSocket.emit('TRADE_REJECTION', reason);
        console.log(`Trade Rejected! ${reason}`)
   });

    cpSocket.on("MULTYSIG_DATA", (msData_cp) => {
        clientSocket.emit('CHANNEL_PUB_KEY', tradeConf.cpPubkey);

        clientSocket.on("MULTYSIG_DATA", (msData_client) => {
            if (msData_cp.redeemScript !== msData_client.redeemScript) {
                clientSocket.emit('TRADE_REJECTION', `Multisig Data is not same on both side`);
                return;
            }
            const commitData = {}
            cpSocket.emit('COMMIT_TO_CHANNEL', commitData);
            cpSocket.on('COMMIT_TX', (cpCommitTx) => {
                clientSocket.emit('COMMIT_TX', {tradeConf, cpCommitTx});
            });
        })
    });

    clientSocket.on('RAW_HEX', rawHex => {
        cpSocket.emit('RAWTX_FOR_SIGNING', rawHex)
    })
    
    cpSocket.on('SIGNED_RAWTX', (signData) => {
        clientSocket.emit("SIGNED_RAWTX", signData);
    })
}

const ltcInstantTrade = (tradeConf, clientSocket, counterpartyConnection) => {
   const cpSocket = socket.io(`http://${counterpartyConnection}`, {reconnection: false, timestampRequests: 1000});
    const { propIdDesired, amountDeisred, amountForSale, clientPubKey, clientAddress } = tradeConf;
   const trade = {
       type: "LTC_INSTANT_TRADE",
       propertyid: propIdDesired,
       amount: amountDeisred,
       price: amountForSale,
       address: clientAddress,
       pubkey: clientPubKey,
   }
   cpSocket.emit('TRADE_REQUEST', trade);

   cpSocket.on('REJECT_TRADE', (reason) => {
       clientSocket.emit('TRADE_REJECTION', reason);
       console.log(`Trade Rejected! ${reason}`)
   });

   cpSocket.on('connect_error', () => {
    clientSocket.emit('TRADE_REJECTION', `Connection Fail`);
   });

   cpSocket.on('TERMINATE_TRADE', (reason) => {
        clientSocket.emit('TRADE_REJECTION', reason);
        console.log(`Trade Rejected! ${reason}`)

   });

   cpSocket.on("MULTYSIG_DATA", (msData_cp) => {
       clientSocket.emit('CHANNEL_PUB_KEY', tradeConf.cpPubkey);

       clientSocket.on("MULTYSIG_DATA", (msData_client) => {
        if (msData_cp.redeemScript !== msData_client.redeemScript) {
            clientSocket.emit('TRADE_REJECTION', `Multisig Data is not same on both side`);
            return;
        }
        const commitData = {}
        cpSocket.emit('COMMIT_TO_CHANNEL', commitData);
        cpSocket.on('COMMIT_TX', (cpCommitTx) => {
            clientSocket.emit('COMMIT_TX', {tradeConf, cpCommitTx});
        })
    })
   });


   clientSocket.on('RAW_HEX', rawHex => {
    cpSocket.emit('RAWTX_FOR_SIGNING', rawHex)
   })

   cpSocket.on('SIGNED_RAWTX', (signData) => {
       clientSocket.emit("SIGNED_RAWTX", signData);
   })
}

module.exports = {
    ltcInstantTrade,
    tokenTokenTrade,
}