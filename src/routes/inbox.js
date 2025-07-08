const express = require("express");

const inbox = require("../controllers/inbox");

const Route = express.Router();

Route.post("/list", inbox.getList);

module.exports = Route;
