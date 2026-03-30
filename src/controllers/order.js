const misc = require('../helpers/response');

const moment = require('moment-timezone');

const uid = require('uuid');

const { sendEmail } = require('../helpers/utils');

const User = require('../models/User');
const Order = require('../models/Order');
const utils = require('../helpers/utils');
const Payment = require('../models/Payment');

module.exports = {
  OrderMp: async (req, res) => {
    const { email, name, club, amount, status, date, address, phone, type, items } = req.body;

    var app = 'MRHPUTIH';

    if (typeof type != 'undefined' || type != '') {
      app = type;
    }

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
          typeof value === 'undefined' ||
          value === '' ||
          (Array.isArray(value) && value.length === 0)
        ) {
          throw new Error(`Field ${field} is required`);
        }
      }

      const userData = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      };

      const userId = await User.register(userData);

      const randomNum = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
      const lastDigits = phone.slice(-5);
      const invoiceValue = `${app}-${lastDigits}${randomNum}`;

      const orderData = {
        club: club.trim(),
        date: moment(date).format('YYYY-MM-DD HH:mm:ss'),
        status: status.trim(),
        address: address.trim(),
        invoice_value: invoiceValue,
        user_name: name,
        type: type,
        user_id: userId,
      };

      if (status == 3 || status == '3') {
        var data = {
          orderId: invoiceValue,
          grossAmount: null,
          totalAmount: amount,
          transactionStatus: 'po',
          transactionId: uid.v4(),
          expire: null,
          app: app.toUpperCase(),
          data: null,
          callbackUrl: null,
          channelId: null,
        };

        await Payment.storeIinbox(data);
      }

      const orderId = await Order.orderMp(orderData);

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
          <li><strong>Status:</strong> ${status == '3' ? 'PO' : 'UNPAID'}</li>
          <li><strong>Event Date:</strong> ${moment(date).format('YYYY-MM-DD HH:mm:ss')}</li>
          <li><strong>Address:</strong> ${address}</li>
          <li><strong>Phone:</strong> ${phone}</li>
          <li><strong>Nominal:</strong> ${utils.formatCurrency(amount)}</li>
        </ul>
        <p>Regards,<br>${app}</p>
      `;

      await sendEmail(
        app,
        'Your Order Confirmation',
        email,
        template,
        'merah-putih-order-confirmation',
      );

      misc.response(res, 200, false, 'Order created successfully', {
        user: { id: userId, ...userData },
        order: { id: orderId, ...orderData },
        order_items: orderItems,
      });
    } catch (e) {
      console.error(e);
      return misc.response(res, 400, true, e.message || 'Something went wrong');
    }
  },
};
