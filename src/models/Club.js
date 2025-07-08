const conn = require("../configs/db");
const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  getClub: () => {
    return new Promise((resolve, reject) => {
      var query = `SELECT no, club FROM clubs`;
      connMP.query(query, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
};
