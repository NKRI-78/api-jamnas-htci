const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  getUsersMp: async (userIds) => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT id, name, phone, email 
      FROM users 
      WHERE id IN (?)
    `;
      connMP.query(query, [userIds], (e, results) => {
        if (err) return reject(e);
        resolve(results);
      });
    });
  },

  getUserMp: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, email, phone FROM users WHERE id = ?`;

      connMP.query(query, id, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
  register: (data) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO users (name, email, phone) 
                VALUES (?, ?, ?)`;

      const values = [data.name, data.email, data.phone];

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
