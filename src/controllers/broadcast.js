const misc = require('../helpers/response');

const Broadcast = require('../models/Broadcast');

module.exports = {
  sendBroadcast: async (req, res) => {
    const { items } = req.body;

    try {
      for (const i in items) {
        var item = items[i];

        var data = {
          email: item.email,
          content: item.content,
          user_id: item.user_id,
        };

        await Broadcast.sendBroadcast(data);
      }

      misc.response(res, 200, false, '');
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
