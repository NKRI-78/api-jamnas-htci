const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  orderListMpByEmail: (email) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT o.id, o.invoice_value, o.created_at, os.name AS status
      FROM orders o 
      INNER JOIN users u ON u.id = o.user_id 
      INNER JOIN order_statuses os ON os.id = o.status
      WHERE u.email = ?`;

      connMP.query(query, email, (e, results) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(results);
        }
      });
    });
  },
  orderListMpByInvoiceValue: (invoiceValue) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT o.id, o.invoice_value, o.created_at, os.name AS status
      FROM orders o 
      INNER JOIN users u ON u.id = o.user_id 
      INNER JOIN order_statuses os ON os.id = o.status
      WHERE o.invoice_value = ?`;

      connMP.query(query, invoiceValue, (e, results) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(results);
        }
      });
    });
  },
  orderItemByOrderId: (orderId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT 
        p.id AS product_id,
        p.title,
        p.img,
        sp.id AS size_id,
        sp.size,
        SUM(oi.qty) AS qty
        FROM 
          order_items oi
          INNER JOIN products p ON p.id = oi.product_id
          INNER JOIN size_prices sp ON sp.id = oi.size_id
        WHERE 
          oi.order_id = ?
        GROUP BY 
          p.id, p.title, p.img, sp.id, sp.size
      `;

      // SELECT
      //   p.id AS product_id,
      //   p.title,
      //   p.img,
      //   GROUP_CONCAT(DISTINCT sp.size ORDER BY sp.size ASC) AS sizes,
      //   GROUP_CONCAT(DISTINCT oi.qty ORDER BY oi.qty ASC) AS qtys
      // FROM
      //   order_items oi
      //   INNER JOIN products p ON p.id = oi.product_id
      //   INNER JOIN size_prices sp ON sp.id = oi.size_id
      // WHERE
      //   oi.order_id = ?
      // GROUP BY
      //   p.id, p.title, p.img

      const values = [orderId];

      connMP.query(query, values, (e, results) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(results);
        }
      });
    });
  },
  orderListMp: () => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        o.id,
        o.user_id,
        o.id AS order_id,
        o.invoice_value,
        o.address,
        o.club,
        o.date,
        os.name AS status_name,
        oi.qty AS item_qty,
        p.id AS product_id,
        p.title AS product_title,
        p.img AS product_image,
        sp.id AS size_id,
        sp.size AS size_name,
        sp.price AS size_price
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      INNER JOIN order_statuses os ON os.id = o.status
      INNER JOIN products p ON p.id = oi.product_id
      INNER JOIN size_prices sp ON sp.id = oi.size_id
    `;

      connMP.query(query, (err, results) => {
        if (err) {
          reject(new Error(e));
        } else {
          resolve(results);
        }
      });
    });
  },

  orderMp: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO orders (address, date, club, status, invoice_value, user_id) 
                VALUES (?, ?, ?, ?, ?, ?)`;

      const values = [
        data.address,
        data.date,
        data.club,
        data.status,
        data.invoice_value,
        data.user_id,
      ];

      connMP.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result.insertId);
        }
      });
    });
  },
  orderItemByUser: (userEmail) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT o.id, o.invoice_value, u.phone, sp.price, oi.qty 
      FROM order_items oi 
      INNER JOIN orders o ON o.id = oi.order_id
      INNER JOIN users u ON u.id = o.user_id
      INNER JOIN size_prices sp ON sp.id = oi.size_id
      WHERE u.email = ? AND o.status = ?
      ORDER BY o.id ASC`;

      const values = [userEmail, 1];

      connMP.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
  orderItemMp: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO order_items (order_id, product_id, size_id, qty) 
                VALUES (?, ?, ?, ?)`;

      const values = [data.order_id, data.product_id, data.size_id, data.qty];

      connMP.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result.insertId);
        }
      });
    });
  },
};
