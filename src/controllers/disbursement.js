const utils = require("../helpers/utils");
const Inbox = require("../models/Inbox");

const axios = require("axios");

const misc = require("../helpers/response");
const inbox = require("./inbox");

module.exports = {
  list: async (_, res) => {
    try {
      var data = await Inbox.getList();

      misc.response(res, 200, false, "", data);
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },

  create: async (req, res) => {
    const { bank, account_bank, amount } = req.body;
    try {
      if (typeof bank == "undefined" || bank == "")
        throw new Error("Field bank is required");

      if (typeof account_bank == "undefined" || account_bank == "")
        throw new Error("Field account_bank is required");

      if (typeof amount == "undefined" || amount == "")
        throw new Error("Field amount is required");

      var data = {
        name: "Admin - MerahPutih",
        bank: bank,
        account_bank: account_bank,
        email: "admin@admin.com",
        amount: amount,
        notes: "-",
        applicant_user_id: 1,
        applicant_name: "MERAHPUTIH",
        applicant_email: "admin@admin.com",
      };

      var config = {
        method: "POST",
        url: process.env.DISBURSEMENT_CREATE,
        data: data,
      };

      var dataInbox = {
        title: `Disbursement by Admin Merah Putih with method payment ${bank} - ${account_bank}`,
        content: `Withdraw amount ${utils.formatCurrency(amount)} successfully`,
        user_id: 1,
      };

      await Inbox.storeInbox(dataInbox);

      const result = await axios(config);

      misc.response(res, 200, false, "", result.data);
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
