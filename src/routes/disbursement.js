const express = require("express");

const disbursement = require("../controllers/disbursement");

const Route = express.Router();

Route.get("/list", disbursement.list);
Route.post("/create", disbursement.create);

module.exports = Route;
