const express = require("express");

const order = require("../controllers/order");

const Route = express.Router();

Route.post("/mp", order.OrderMp);

module.exports = Route;
