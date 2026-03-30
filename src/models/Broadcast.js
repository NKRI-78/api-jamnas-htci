const conn = require('../configs/db_web_merah_putih');

module.exports = {
  sendBroadcast: (data) => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO broadcasts (username, email, phone, status, user_id, club, content, items)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const itemsPayload = Array.isArray(data.items)
        ? JSON.stringify(data.items)
        : (data.items ?? null);

      conn.query(
        query,
        [
          data.username,
          data.email,
          data.phone,
          data.status,
          data.user_id,
          data.club,
          data.content,
          itemsPayload,
        ],
        (e, result) => {
          if (e) reject(new Error(e));
          else resolve(result);
        },
      );
    });
  },

  listBroadcast: ({ page = 1, limit = 20, search = '', status = '', user_id = '' }) => {
    return new Promise((resolve, reject) => {
      const safePage = Math.max(parseInt(page, 10) || 1, 1);
      const safeLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
      const offset = (safePage - 1) * safeLimit;

      let where = ' WHERE 1=1 ';
      const values = [];

      if (search) {
        where += ' AND (username LIKE ? OR email LIKE ? OR phone LIKE ? OR content LIKE ?) ';
        values.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
      }

      if (status) {
        where += ' AND status = ? ';
        values.push(status);
      }

      if (user_id) {
        where += ' AND user_id = ? ';
        values.push(user_id);
      }

      const countQuery = `SELECT COUNT(*) as total FROM broadcasts ${where}`;
      conn.query(countQuery, values, (countErr, countRows) => {
        if (countErr) return reject(new Error(countErr));

        const total = countRows?.[0]?.total || 0;
        const dataQuery = `
          SELECT id, username, email, phone, status, content, items, user_id, created_at, updated_at
          FROM broadcasts
          ${where}
          ORDER BY id DESC
          LIMIT ? OFFSET ?
        `;

        conn.query(dataQuery, [...values, safeLimit, offset], (dataErr, rows) => {
          if (dataErr) return reject(new Error(dataErr));
          resolve({
            items: rows,
            page: safePage,
            limit: safeLimit,
            total,
            totalPage: Math.ceil(total / safeLimit) || 1,
          });
        });
      });
    });
  },
};
