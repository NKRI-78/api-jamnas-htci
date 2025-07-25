const express = require("express");

const admin = require("../controllers/admin");

const Route = express.Router();

Route.get("/balance-mp", admin.BalanceMp)
  .get("/order-list-mp", admin.OrderListMp)
  .put("/update/payment", admin.UpdatePayment);

module.exports = Route;
