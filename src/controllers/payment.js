const misc = require("../helpers/response");

const moment = require("moment-timezone");

const axios = require("axios");

const Payment = require("../models/Payment");

module.exports = {
  getList: async (_, res) => {
    try {
      const payments = await Payment.getList();

      misc.response(res, 200, false, "", payments);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },

  storeMp: async (req, res) => {
    try {
      misc.response(res, 200, false, "", {});
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },

  storeHtci: async (req, res) => {
    const {
      channel_id,
      payment_code,
      email,
      name,
      club,
      date,
      detail_address,
      phone,
      size_xl,
      size_s,
      size_m,
      size_l,
      size_2xl,
      size_3xl,
      size_4xl,
      size_5xl,
    } = req.body;

    try {
      var invoiceValue =
        `JAMNASHTCI-` +
        date.replace(/[^a-zA-Z0-9\s]/g, "") +
        "-" +
        (Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000);

      var dataPayment = {
        email: email,
        name: name,
        club: club,
        date: date,
        detail_address: detail_address,
        phone: phone,
        order_id: invoiceValue,
        size_xl: size_xl,
        size_s: size_s,
        size_m: size_m,
        size_l: size_l,
        size_2xl: size_2xl,
        size_3xl: size_3xl,
        size_4xl: size_4xl,
        size_5xl: size_5xl,
      };

      await Payment.storePayment(dataPayment);

      var callbackUrl = process.env.CALLBACK;

      var data = {
        channel_id: channel_id,
        orderId: invoiceValue,
        amount: 155000,
        app: "JAMNASHTCI",
        callbackUrl: callbackUrl,
      };

      var config = {
        method: "POST",
        url: process.env.PAY_MIDTRANS,
        data: data,
      };

      const result = await axios(config);

      var paymentAccess;
      var paymentType;
      var paymentExpire;

      if (
        payment_code == "gopay" ||
        payment_code == "shopee" ||
        payment_code == "ovo" ||
        payment_code == "dana"
      ) {
        paymentAccess = result.data.data.data.actions[0].url;
        paymentType = "emoney";

        paymentExpire = moment()
          .tz("Asia/Jakarta")
          .add(30, "minutes")
          .format("YYYY-MM-DD HH:mm:ss");
      } else {
        paymentAccess = result.data.data.data.vaNumber;
        paymentType = "va";
        paymentExpire = result.data.data.expire;
      }

      misc.response(res, 200, false, "", {
        order_id: invoiceValue,
        payment_access: paymentAccess,
        payment_type: paymentType,
        payment_expire: paymentExpire,
      });
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
