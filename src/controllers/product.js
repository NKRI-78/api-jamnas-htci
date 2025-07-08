const misc = require("../helpers/response");

const moment = require("moment-timezone");

const axios = require("axios");

const Product = require("../models/Product");

module.exports = {
  getProductMerahPutihList: async (_, res) => {
    try {
      const products = await Product.getProductMerahPutihList();
      var data = [];

      for (const i in products) {
        var product = products[i];

        var sizes = await Product.getSizePrices();

        var dataSize = [];

        for (const z in sizes) {
          var size = sizes[z];

          dataSize.push({
            id: size.id,
            size: size.size,
            price: parseInt(size.price),
          });
        }

        data.push({
          id: product.id,
          title: product.title,
          img: product.img,
          sizes: dataSize,
        });
      }

      misc.response(res, 200, false, "", data);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
