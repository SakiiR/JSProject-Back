const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./api/route/index');

const app = express();
const port = process.env.PORT || 3000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/ChatRouletteDB');

var AuthController = require('./auth/AuthController');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api/auth', AuthController);

routes(app);
app.listen(port);

console.log('#BalanceTonPort: ' + port);

module.exports = app;