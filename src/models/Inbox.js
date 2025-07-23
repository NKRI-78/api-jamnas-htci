const connMP = require("../configs/db_web_merah_putih");

module.exports = {
  getList: () => {
    return new Promise((resolve, reject) => {
      var query = `SELECT title, content FROM inboxes`;
      connMP.query(query, (e, result) => {
        if (e) {
          reject(new Error(e));
        } else {
          resolve(result);
        }
      });
    });
  },

  storeInbox: (data) => {
    return new Promise((resolve, reject) => {
      var query = `INSERT INTO inboxes (title, content, user_id) VALUES (?, ?, ?)`;
      connMP.query(
        query,
        [data.title, data.content, data.user_id],
        (e, result) => {
          if (e) {
            reject(new Error(e));
          } else {
            resolve(result);
          }
        }
      );
    });
  },
};
