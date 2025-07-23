const misc = require("../helpers/response");

const axios = require("axios");

module.exports = {
  list: async (_, res) => {
    try {
      const config = {
        method: "GET",
        url: process.env.DISBURSEMENT_BANK,
      };

      const result = await axios(config);

      misc.response(res, 200, false, "", result.data.data);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
