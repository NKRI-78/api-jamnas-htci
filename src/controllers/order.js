const misc = require("../helpers/response");

const moment = require("moment-timezone");

const { sendEmail } = require("../helpers/utils");

const User = require("../models/User");
const Order = require("../models/Order");

module.exports = {
  OrderMp: async (req, res) => {
    const { email, name, club, status, date, address, phone, items } = req.body;

    try {
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
      const lastDigits = phone.slice(-5);
      const invoiceValue = `MRHPUTIH-${lastDigits}${randomNum}`;

      // ✅ Prepare order data
      const orderData = {
        club: club.trim(),
        date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
        status: status.trim(),
        address: address.trim(),
        invoice_value: invoiceValue,
        user_id: userId,
      };

      const orderId = await Order.orderMp(orderData);

      // ✅ Insert order items
      const orderItems = [];

      for (const item of items) {
        for (const size of item.sizes) {
          const orderItemData = {
            order_id: orderId,
            size_id: size.id,
            qty: size.qty,
            product_id: item.product_id,
          };

          await Order.orderItemMp(orderItemData);
          orderItems.push(orderItemData);
        }
      }

      const template = `
        <h2>Hi ${name},</h2>
        <p>Thank you for your order! Here is a summary:</p>
        <ul>
          <li><strong>Invoice:</strong> ${invoiceValue}</li>
          <li><strong>Club:</strong> ${club}</li>
          <li><strong>Status:</strong> ${status == "3" ? "PO" : "UNPAID"}</li>
          <li><strong>Event Date:</strong> ${moment(date).format(
            "YYYY-MM-DD HH:mm:ss"
          )}</li>
          <li><strong>Address:</strong> ${address}</li>
          <li><strong>Phone:</strong> ${phone}</li>
        </ul>
        <p>Regards,<br>MerahPutih</p>
      `;

      await sendEmail(
        "MerahPutih",
        "Your Order Confirmation",
        email,
        template,
        "merah-putih-order-confirmation"
      );

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
