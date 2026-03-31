const misc = require('../helpers/response');
const Admin = require('../models/Admin');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const User = require('../models/User');

module.exports = {
  UpdatePayment: async (req, res) => {
    const { status, order_id } = req.body;

    try {
      await Admin.updatePaymentPaid(status, order_id);

      misc.response(res, 200, false, '', {
        order_id: order_id,
        status: status,
      });
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message || 'Something went wrong');
    }
  },

  BalanceMp: async (req, res) => {
    const { type } = req.query;

    try {
      // 1) Get all user balances
      const balances = await Admin.getBalance(type);

      // 2) Calculate total balance
      const totalBalance = balances.reduce((acc, user) => {
        return acc + parseFloat(user.balance || 0);
      }, 0);

      // 3) Prepare final result
      const result = {
        total: totalBalance,
        users: balances,
      };

      // 4) Send response
      misc.response(res, 200, false, '', result);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message || 'Something went wrong');
    }
  },
  OrderListMp: async (req, res) => {
    const { type } = req.query;

    try {
      const orders = await Order.orderListMp(type);

      if (orders.length === 0) {
        return misc.response(res, 200, false, 'No orders found', []);
      }

      const userIds = [...new Set(orders.map((order) => order.user_id))];
      const users = userIds.length > 0 ? await User.getUsersMp(userIds) : [];

      const userMap = {};
      for (const user of users) {
        userMap[user.id] = {
          id: user.id || null,
          name: user.name || null,
          phone: user.phone || null,
          email: user.email || null,
        };
      }

      const groupedOrders = {};

      for (const order of orders) {
        const orderId = order.id;
        const qty = parseInt(order.item_qty, 10) || 0;
        const price = parseInt(order.size_price, 10) || 0;

        if (!groupedOrders[orderId]) {
          groupedOrders[orderId] = {
            id: orderId,
            invoice: order.invoice_value,
            status: order.status_name,
            address: order.address,
            date: order.date,
            club: order.club,
            order_username: order.order_username,
            user: userMap[order.user_id] || {
              name: null,
              phone: null,
              email: null,
            },
            total: 0, // ← di luar items
            items: [],
          };
        }

        // akumulasi total
        groupedOrders[orderId].total += qty * price;

        let product = groupedOrders[orderId].items.find(
          (item) => item.product_id === order.product_id,
        );

        if (!product) {
          product = {
            product_id: order.product_id,
            title: order.product_title,
            img: order.product_image,
            measures: [],
          };
          groupedOrders[orderId].items.push(product);
        }

        product.measures.push({
          size: order.size_name,
          qty,
          price,
        });
      }

      const dataOrder = Object.values(groupedOrders);

      return misc.response(res, 200, false, '', dataOrder);
    } catch (error) {
      console.error(error);
      return misc.response(res, 400, true, error.message || 'Something went wrong');
    }
  },
};
