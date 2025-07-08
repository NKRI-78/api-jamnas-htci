const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  getBalance: () => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT 
        u.id AS user_id,
        u.name AS user_name,
        u.email AS user_email,
        u.phone AS user_phone,
        SUM(oi.qty * sp.price) AS balance
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      INNER JOIN order_statuses os ON os.id = o.status
      INNER JOIN size_prices sp ON sp.id = oi.size_id
      INNER JOIN users u ON u.id = o.user_id
      GROUP BY u.id, u.name, u.email, u.phone
    `;

      connMP.query(query, (e, results) => {
        if (e) {
          reject(new Error(e));
        }
        resolve(results);
      });
    });
  },
};
