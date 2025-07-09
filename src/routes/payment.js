const express = require("express");

const payment = require("../controllers/payment");

const Route = express.Router();

Route.get("/list", payment.getList)
  .post("/store-mp", payment.storeMp)
  .post("/store-po-mp", payment.storePoMp)
  .post("/store", payment.storeHtci);

module.exports = Route;
