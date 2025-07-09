const conn = require("../configs/db");
const connPayment = require("../configs/db_payment");
const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  getList: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, nameCode, logo, platform, fee FROM Channels WHERE nameCode != 'bca'`;
      connPayment.query(query, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  getEmailByInvoiceValue: (invoiceValue) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT u.email FROM orders o 
      INNER JOIN users u ON u.id = o.user_id
      WHERE invoice_value = ?`;
      const values = [invoiceValue];
      connPayment.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  getListByPaymentCode: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, nameCode, logo, platform, fee FROM Channels WHERE nameCode = ?`;
      connPayment.query(query, id, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  getListByPaymentChannel: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, nameCode, logo, platform, fee FROM Channels WHERE id = ?`;
      connPayment.query(query, id, (e, result) => {
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

  checkPaymentIsExist: (orderId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT orderId, grossAmount AS amount, ChannelId, data, expire FROM Payments WHERE orderId = ?`;

      const values = [orderId];

      connPayment.query(query, values, (e, result) => {
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

  updatePoIntoUnpaid: (invoiceValue) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE orders SET status = 1 WHERE invoice_value = ?`;

      const values = [invoiceValue];

      connMP.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  updateInvoiceValue: (invoiceValue, orderId) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE orders SET invoice_value = ? WHERE id = ?`;

      const values = [invoiceValue, orderId];

      connMP.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
};
