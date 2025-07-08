const misc = require("../helpers/response");

const moment = require("moment-timezone");

const User = require("../models/User");
const Order = require("../models/Order");

module.exports = {
  OrderMp: async (req, res) => {
    const { email, name, club, status, date, address, phone, items } = req.body;

    try {
      // ✅ Validate required fields
      const requiredFields = {
        email,
        name,
        club,
        status,
        date,
        address,
        phone,
        items,
      };

      for (const [field, value] of Object.entries(requiredFields)) {
        if (
          typeof value === "undefined" ||
          value === "" ||
          (Array.isArray(value) && value.length === 0)
        ) {
          throw new Error(`Field ${field} is required`);
        }
      }

      // ✅ Register or get user
      const userData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      const userId = await User.register(userData);

      // ✅ Generate invoice number
      const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      const invoiceValue = `MRHPUTIH-${phone}${randomNum}`;

      // ✅ Prepare order data
      const orderData = {
        club: club.trim(),
        date: date ? moment(date).format("YYYY-MM-DD HH:mm:ss") : null,
        status: status.trim(),
        address: address.trim(),
        invoice_value: invoiceValue,
        user_id: userId,
      };

      const orderId = await Order.orderMp(orderData);

      // ✅ Insert order items
      const orderItems = [];

      for (const item of items) {
        const orderItemData = {
          order_id: orderId,
          product_id: item.product_id,
          size_id: item.size_id,
          qty: item.qty,
        };

        await Order.orderItemMp(orderItemData);
        orderItems.push(orderItemData);
      }

      return misc.response(res, 200, false, "Order created successfully", {
        user: { id: userId, ...userData },
        order: { id: orderId, ...orderData },
        order_items: orderItems,
      });
    } catch (e) {
      console.error(e);
      return misc.response(res, 400, true, e.message || "Something went wrong");
    }
  },
};
