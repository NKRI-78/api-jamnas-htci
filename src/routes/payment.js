const express = require("express");

const payment = require("../controllers/payment");

const Route = express.Router();

Route.get("/list", payment.getList)
  .post("/store-merah-putih", payment.storeMerahPutih)
  .post("/store", payment.storeHtci);

module.exports = Route;
