const express = require("express")

const club = require("../controllers/club")

const Route = express.Router()

Route
    .get("/list", club.getList)

module.exports = Route