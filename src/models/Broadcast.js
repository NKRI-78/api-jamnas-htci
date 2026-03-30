const conn = require('../configs/db_web_merah_putih');

module.exports = {
  sendBroadcast: (data) => {
    return new Promise((resolve, reject) => {
      var query = `INSERT INTO broadcasts (email, content, user_id) VALUES (?, ?, ?)`;
      conn.query(query, [data.email, data.content, data.user_id], (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },
};
