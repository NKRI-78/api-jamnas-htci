const express = require("express");

const bank = require("../controllers/bank");

const Route = express.Router();

Route.get("/", bank.list);

module.exports = Route;
