const express = require("express");

const admin = require("./routes/admin");
const bank = require("./routes/bank");
const club = require("./routes/club");
const disbursement = require("./routes/disbursement");
const payment = require("./routes/payment");
const inbox = require("./routes/inbox");
const callback = require("./routes/callback");
const order = require("./routes/order");
const product = require("./routes/product");

const Route = express.Router();

Route.use("/api/v1/admin", admin)
  .use("/api/v1/club", club)
  .use("/api/v1/bank", bank)
  .use("/api/v1/payment", payment)
  .use("/api/v1/disbursement", disbursement)
  .use("/api/v1/inbox", inbox)
  .use("/api/v1/order", order)
  .use("/api/v1/product", product)
  .use("/api/v1/callback", callback);

module.exports = Route;
