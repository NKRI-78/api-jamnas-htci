const misc = require("../helpers/response");

const Order = require("../models/Order");
const Payment = require("../models/Payment");

module.exports = {
  getList: async (req, res) => {
    const { email } = req.body;

    try {
      var orders = await Order.orderListMpByEmail(email);

      var dataOrder = [];

      for (const i in orders) {
        var order = orders[i];

        var id = order.id;
        var invoiceValue = order.invoice_value;
        var status = order.status;
        var createdAt = order.created_at;

        var rows = await Order.orderItemByOrderId(id);

        const products = [];

        for (const row of rows) {
          let product = products.find((p) => p.product_id === row.product_id);

          if (!product) {
            product = {
              product_id: row.product_id,
              title: row.title,
              img: row.img,
              sizes: [],
            };
            products.push(product);
          }

          product.sizes.push({
            id: row.size_id,
            size: row.size,
            qty: parseInt(row.qty),
          });
        }

        var payments = await Payment.checkPaymentIsExist(invoiceValue);
        var amount = payments.length == 0 ? "0" : payments[0].amount;
        var channelId = payments.length == 0 ? "-" : payments[0].ChannelId;
        var expire = payments.length == 0 ? new Date() : payments[0].expire;

        var data = payments.length == 0 ? "{}" : payments[0].data;

        var dataParse = {};
        try {
          dataParse =
            typeof data === "string" && data.trim() !== ""
              ? JSON.parse(data)
              : {};
        } catch (err) {
          console.error("Invalid JSON in payment.data:", data, err);
          dataParse = {};
        }

        var paymentAccess;

        if (Array.isArray(dataParse.actions)) {
          paymentAccess = dataParse.actions[0].url;
        } else {
          paymentAccess = dataParse.vaNumber ?? "-";
        }

        var banks = await Payment.getListByPaymentChannel(channelId);

        dataOrder.push({
          order_id: invoiceValue,
          amount: parseInt(amount),
          payment_access: paymentAccess,
          payment_type: dataParse.paymentType === "echannel" ? "va" : "emoney",
          payment_expire: expire,
          status: status,
          created_at: createdAt,
          bank: banks.length === 0 ? {} : banks[0],
          products,
        });
      }

      misc.response(res, 200, false, "", dataOrder);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },

  detail: async (req, res) => {
    const { order_id } = req.params;

    try {
      var orders = await Order.orderListMpByInvoiceValue(order_id);

      if (orders.length == 0) {
        throw new Error("Order Detail not found");
      }

      var dataOrder = [];

      for (const i in orders) {
        var order = orders[i];

        var id = order.id;
        var invoiceValue = order.invoice_value;
        var status = order.status;
        var createdAt = order.created_at;

        var rows = await Order.orderItemByOrderId(id);

        const products = [];

        for (const row of rows) {
          let product = products.find((p) => p.product_id === row.product_id);

          if (!product) {
            product = {
              product_id: row.product_id,
              title: row.title,
              img: row.img,
              sizes: [],
            };
            products.push(product);
          }

          product.sizes.push({
            id: row.size_id,
            size: row.size,
            qty: parseInt(row.qty),
          });
        }

        var payments = await Payment.checkPaymentIsExist(invoiceValue);
        var amount = payments.length == 0 ? "0" : payments[0].amount;
        var channelId = payments.length == 0 ? "-" : payments[0].ChannelId;
        var expire = payments.length == 0 ? new Date() : payments[0].expire;

        var data = payments.length == 0 ? "{}" : payments[0].data;

        var dataParse = {};
        try {
          dataParse =
            typeof data === "string" && data.trim() !== ""
              ? JSON.parse(data)
              : {};
        } catch (err) {
          console.error("Invalid JSON in payment.data:", data, err);
          dataParse = {};
        }

        var paymentAccess;

        if (Array.isArray(dataParse.actions)) {
          paymentAccess = dataParse.actions[0].url;
        } else {
          paymentAccess = dataParse.vaNumber ?? "-";
        }

        var banks = await Payment.getListByPaymentChannel(channelId);

        dataOrder.push({
          order_id: invoiceValue,
          amount: parseInt(amount),
          payment_access: paymentAccess,
          payment_type: dataParse.paymentType === "echannel" ? "va" : "emoney",
          payment_expire: expire,
          status: status,
          created_at: createdAt,
          bank: banks.length === 0 ? {} : banks[0],
          products,
        });
      }

      misc.response(res, 200, false, "", dataOrder[0]);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
