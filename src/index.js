const express = require("express")

const club = require("./routes/club")
const payment = require("./routes/payment")
const callback = require("./routes/callback")

const Route = express.Router()

Route
    .use("/api/v1/club", club)
    .use("/api/v1/payment", payment)
    .use("/api/v1/callback", callback);

module.exports = Route