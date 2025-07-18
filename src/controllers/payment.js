const misc = require("../helpers/response");

const moment = require("moment-timezone");

const axios = require("axios");

const Payment = require("../models/Payment");
const Order = require("../models/Order");
const { sendEmail } = require("../helpers/utils");
const utils = require("../helpers/utils");

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
    const { payment_code, channel_id, email } = req.body;

    var totalAmount = 0;

    var id = "";
    var phone = "";
    var invoiceValue = "";

    var items = await Order.orderItemByUser(email);

    var payments = await Payment.getListByPaymentCode(payment_code);

    try {
      if (typeof payment_code == "undefined" || payment_code == "") {
        throw new Error("Field payment_code is required");
      }

      if (typeof channel_id == "undefined" || channel_id == "") {
        throw new Error("Field channel_id is required");
      }

      if (typeof email == "undefined" || email == "") {
        throw new Error("Field email is required");
      }

      for (const item of items) {
        totalAmount += item.price * item.qty;

        id = item.id;
        invoiceValue = item.invoice_value;
        phone = item.phone;
      }

      if (invoiceValue == "") throw new Error("invoice_value is required");

      var checkPaymentIsExist = await Payment.checkPaymentIsExist(invoiceValue);

      if (checkPaymentIsExist.length != 0) {
        const lastDigits = phone.slice(-5);
        const randomNum =
          Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
        invoiceValue = `MRHPUTIH-${lastDigits}${randomNum}`;

        await Payment.updateInvoiceValue(invoiceValue, id);
      }

      const callbackUrl = process.env.CALLBACK_MP;

      const payload = {
        channel_id: channel_id,
        orderId: invoiceValue,
        amount: totalAmount,
        app: "MRHPUTIH",
        callbackUrl: callbackUrl,
      };

      const config = {
        method: "POST",
        url: process.env.PAY_MIDTRANS,
        data: payload,
      };

      const result = await axios(config);

      var paymentAccess, paymentType, paymentCode, paymentExpire;

      if (["gopay", "shopee", "ovo", "dana"].includes(payment_code)) {
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

      paymentCode = payment_code;

      await sendEmail(
        "MerahPutih",
        "Pembayaran",
        email,
        utils.templateStoreMp(
          invoiceValue,
          result.data.data.totalAmount,
          paymentCode,
          paymentExpire,
          paymentType,
          paymentAccess
        ),
        "payment-merah-putih"
      );

      misc.response(res, 200, false, "", {
        order_id: invoiceValue,
        amount: result.data.data.totalAmount,
        payment_access: paymentAccess,
        payment_type: paymentType,
        payment_expire: paymentExpire,
        bank: payments.length == 0 ? {} : payments[0],
      });
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },

  storePoMp: async (req, res) => {
    const { payment_code, channel_id, email, invoice_value } = req.body;

    var totalAmount = 0;

    var items = await Order.orderItemByInvoiceValue(invoice_value);

    var payments = await Payment.getListByPaymentCode(payment_code);

    try {
      if (typeof payment_code == "undefined" || payment_code == "") {
        throw new Error("Field payment_code is required");
      }

      if (typeof channel_id == "undefined" || channel_id == "") {
        throw new Error("Field channel_id is required");
      }

      if (typeof invoice_value == "undefined" || invoice_value == "") {
        throw new Error("Field invoice_value is required");
      }

      if (items.length == 0) {
        throw new Error("Invoice not found");
      }

      var checkPaymentIsExist = await Payment.checkPaymentIsExist(
        invoice_value
      );

      if (checkPaymentIsExist.length != 0) {
        throw new Error("Invoice already registered");
      }

      for (const item of items) {
        totalAmount += item.price * item.qty;
      }

      const callbackUrl = process.env.CALLBACK_MP;

      const payload = {
        channel_id: channel_id,
        orderId: invoice_value,
        amount: totalAmount,
        app: "MRHPUTIH",
        callbackUrl: callbackUrl,
      };

      const config = {
        method: "POST",
        url: process.env.PAY_MIDTRANS,
        data: payload,
      };

      const result = await axios(config);

      var paymentAccess, paymentType, paymentCode, paymentExpire;

      if (["gopay", "shopee", "ovo", "dana"].includes(payment_code)) {
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

      paymentCode = payment_code;

      console.log(email);

      await sendEmail(
        "MerahPutih",
        "Pembayaran",
        email,
        utils.templateStoreMp(
          invoice_value,
          result.data.data.totalAmount,
          paymentCode,
          paymentExpire,
          paymentType,
          paymentAccess
        ),
        "payment-merah-putih"
      );

      // await Payment.updatePoIntoUnpaid(invoice_value);

      misc.response(res, 200, false, "", {
        order_id: invoice_value,
        amount: result.data.data.totalAmount,
        payment_access: paymentAccess,
        payment_type: paymentType,
        payment_expire: paymentExpire,
        bank: payments.length == 0 ? {} : payments[0],
      });
    } catch (e) {
      console.error(e);
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
