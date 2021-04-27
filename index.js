const express = require('express');
const app = express();

const config = require('./config');
const SERVER_PORT = config.SERVER_PORT || 3002;
const SOCKET_PORT = config.SOCKET_PORT || 75;

const cors = require("cors")
app.use(cors())

const routes = require('./routes');
routes.configureRoutes(app);

const io = require('socket.io')(SOCKET_PORT, config.socketIoConfig);
const socketService = require('./sockets');
io.on('connection', socketService.handleConnection);

const listernCB = () => console.log(`Server Started on port ${SERVER_PORT}`)
app.listen(SERVER_PORT, listernCB);
