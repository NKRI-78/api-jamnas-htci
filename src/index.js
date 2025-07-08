const express = require("express");

const admin = require("./routes/admin");
const club = require("./routes/club");
const payment = require("./routes/payment");
const callback = require("./routes/callback");
const order = require("./routes/order");
const product = require("./routes/product");

const Route = express.Router();

Route.use("/api/v1/admin", admin)
  .use("/api/v1/club", club)
  .use("/api/v1/payment", payment)
  .use("/api/v1/order", order)
  .use("/api/v1/product", product)
  .use("/api/v1/callback", callback);

module.exports = Route;
