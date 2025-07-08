const express = require("express");

const inbox = require("../controllers/inbox");

const Route = express.Router();

Route.post("/list", inbox.getList);
Route.get("/detail/:order_id", inbox.detail);

module.exports = Route;
