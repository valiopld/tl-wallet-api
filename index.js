const express = require('express');
const app = express();

const config = require('./config');
const SERVER_PORT = config.SERVER_PORT;

const cors = require("cors");
app.use(cors());

const routes = require('./src/routes');
routes.configureRoutes(app);

const socketsService = require('./src/sockets');
socketsService.connect();

const listernCB = () => console.log(`Server Started on port ${SERVER_PORT}`);
app.listen(SERVER_PORT, listernCB);
