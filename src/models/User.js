const connMerahPutih = require("../configs/db_web_merah_putih");

module.exports = {
  getUsersMp: async (userIds) => {
    return new Promise((resolve, reject) => {
      const query = `
      SELECT id, name, phone, email 
      FROM users 
      WHERE id IN (?)
    `;
      connMerahPutih.query(query, [userIds], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  getUserMp: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, name, email, phone FROM users WHERE id = ?`;

      connMerahPutih.query(query, id, (e, result) => {
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

      connMerahPutih.query(query, values, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result.insertId);
        }
      });
    });
  },
};
