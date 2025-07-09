const misc = require("../helpers/response");
const { sendEmail } = require("../helpers/utils");
const Payment = require("../models/Payment");

module.exports = {
  callback: async (req, res) => {
    const { order_id, status } = req.body;

    try {
      if (status == "PAID") {
        await Payment.updatePaymentPaid(order_id);
      }
      misc.response(res, 200, false, "Callback called");
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },

  callbackMp: async (req, res) => {
    const { order_id, status } = req.body;

    try {
      if (status == "PAID") {
        await Payment.updatePaymentPaid(order_id);

        var orders = await Payment.getEmailByInvoiceValue(order_id);

        await sendEmail(
          "MerahPutih",
          `ORDER ID #${order_id} Successfully Paid !`,
          orders.length == 0 ? "-" : orders[0].email,
          `<h1>Please check our website for any detail. https://merah-putih-htci-dki-jakarta.langitdigital78.com</h1>`,
          "payment-paid-merah-putih"
        );
      }
      misc.response(res, 200, false, "Callback MP called");
    } catch (e) {
      console.log(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
