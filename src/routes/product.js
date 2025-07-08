const express = require("express");

const product = require("../controllers/product");

const Route = express.Router();

Route.get("/list-mp", product.getProductMerahPutihList);

module.exports = Route;
