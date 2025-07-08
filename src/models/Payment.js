const conn = require("../configs/db");
const connPayment = require("../configs/db_payment");
const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  getList: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, nameCode, logo, platform, fee FROM Channels`;
      connPayment.query(query, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  storePayment: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO orders (email, name, club, date, detail_address, size_xl, size_s, size_m, size_l, 
                size_2xl, size_3xl, size_4xl, size_5xl, size_6xl, size_7xl, phone, order_id) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

      const values = [
        data.email,
        data.name,
        data.club,
        data.date,
        data.detail_address,
        data.size_xl,
        data.size_s,
        data.size_m,
        data.size_l,
        data.size_2xl,
        data.size_3xl,
        data.size_4xl,
        data.size_5xl,
        data.size_6xl,
        data.size_7xl,
        data.phone,
        data.order_id,
      ];

      conn.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  updatePaymentPaid: (orderId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE orders SET status = 2 WHERE invoice_value = ?`;

      connMP.query(query, orderId, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
};
