const mongoose = require('mongoose');
const config = require('./env.config');
const connectConf = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
const mongoURL = `mongodb://${config.DB_HOST}/${config.DB_NAME}`;
mongoose.connect(mongoURL, connectConf);

const db = mongoose.connection;
db.on('error', (error) => console.log(`Error with DB Connection! ${error.message}`));
db.once('open', () => console.log(`Connected to DB by Mongoose !`));