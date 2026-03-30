const express = require('express');

const broadcast = require('../controllers/broadcast');

const Route = express.Router();

Route.get('/', broadcast.listBroadcast);
Route.post('/', broadcast.sendBroadcast);

module.exports = Route;
