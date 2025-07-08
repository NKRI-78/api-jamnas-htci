const express = require("express");

const callback = require("../controllers/callback");

const Route = express.Router();

Route.post("/", callback.callback).post("/mp", callback.callbackMp);

module.exports = Route;
