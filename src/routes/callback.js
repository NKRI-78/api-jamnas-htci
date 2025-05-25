const express = require("express")

const callback = require("../controllers/callback")

const Route = express.Router()

Route
    .get("/", callback.callback)

module.exports = Route