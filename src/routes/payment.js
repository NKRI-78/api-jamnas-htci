const express = require("express")

const payment = require("../controllers/payment")

const Route = express.Router()

Route
    .get("/list", payment.getList)
    .post("/store", payment.storePayment)

module.exports = Route