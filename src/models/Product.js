const conn = require("../configs/db");
const connMerahPutih = require("../configs/db_web_merah_putih");

module.exports = {
  getProductMerahPutihList: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM products`;

      connMerahPutih.query(query, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
  getSizePrices: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, size, price FROM size_prices`;

      connMerahPutih.query(query, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
};
