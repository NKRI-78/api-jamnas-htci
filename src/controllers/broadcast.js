const misc = require('../helpers/response');
const Broadcast = require('../models/Broadcast');
const { sendEmail, formatCurrency } = require('../helpers/utils');

const buildPreorderMessage = (item) => {
  const orderNo = item.order_no;
  const orderDate = item.order_date;
  const total = item.total;
  const phone = item.phone;
  const due = '[batas waktu]';
  const payLink = 'https://dummy-payment-link.example.com';

  return {
    text: `Halo kak,\n\nMakasih ya sudah pre-order. Pesanannya sudah siap diproses nih.\nYuk langsung lanjut pembayaran dulu ya:\n\nNo Pesanan : ${orderNo}\nTotal : ${formatCurrency(total)}\nTanggal Pemesanan : ${orderDate}\nNo Handphone : ${phone}\n\nUsahakan bayar sebelum ${due} ya kak, biar pesanan kakak bisa cepat diproses.\nKalau sudah transfer, jangan lupa kirim bukti yaa / Bayar langsung di apps (Otomatis).\n\nMakasih banyak kak!\nLink: ${payLink}`,
    html: `
      <div style="font-family: Arial, sans-serif; color: #222; line-height: 1.6;">
        <p>Halo kak,</p>
        <p>Makasih ya sudah pre-order. Pesanannya sudah siap diproses nih.<br/>Yuk langsung lanjut pembayaran dulu ya:</p>
        <table style="border-collapse: collapse; width: 100%; margin: 12px 0;">
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>No Pesanan</b></td><td style="padding:8px;border:1px solid #ddd;">${orderNo}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Total</b></td><td style="padding:8px;border:1px solid #ddd;">${formatCurrency(total)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>Tanggal Pemesanan</b></td><td style="padding:8px;border:1px solid #ddd;">${orderDate}</td></tr>
          <tr><td style="padding:8px;border:1px solid #ddd;"><b>No Handphone</b></td><td style="padding:8px;border:1px solid #ddd;">${phone}</td></tr>
        </table>
        <p>Usahakan bayar sebelum <b>${due}</b> ya kak, biar pesanan kakak bisa cepat diproses.<br/>
        Kalau sudah transfer, jangan lupa kirim bukti yaa / Bayar langsung di apps (Otomatis).</p>
        <p>Makasih banyak kak!</p>
        <p><a href="${payLink}" style="display:inline-block;padding:10px 14px;background:#E91E63;color:#fff;text-decoration:none;border-radius:6px;">Lanjut Pembayaran</a></p>
      </div>
    `,
  };
};

module.exports = {
  listBroadcast: async (req, res) => {
    try {
      const page = req.query.page || 1;
      const limit = req.query.limit || 20;
      const search = req.query.search || '';
      const status = req.query.status || '';
      const user_id = req.query.user_id || '';

      const result = await Broadcast.listBroadcast({ page, limit, search, status, user_id });
      misc.response(res, 200, false, 'Success get list broadcast', result);
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },

  sendBroadcast: async (req, res) => {
    const { items } = req.body;

    try {
      if (!Array.isArray(items) || items.length === 0) {
        throw new Error('items is required and must be array');
      }

      for (const item of items) {
        if (
          !item.order_no ||
          !item.order_date ||
          !item.total ||
          !item.phone ||
          !item.email ||
          !item.user_id ||
          !item.club
        ) {
          throw new Error('Each item requires: email, user_id, order_no, total, order_date, phone');
        }

        const content = buildPreorderMessage(item);

        const data = {
          username: item.username,
          email: item.email,
          phone: item.phone,
          status: item.status,
          user_id: item.user_id,
          club: item.club,
          content: content.text,
          items: item.products,
        };

        await Broadcast.sendBroadcast(data);

        await sendEmail(
          'HTCI',
          'Pre-order: Lanjut Pembayaran',
          item.email,
          content.html,
          'another-otp',
        );
      }

      misc.response(res, 200, false, 'Broadcast, email sent');
    } catch (e) {
      console.error(e);
      misc.response(res, 400, true, e.message);
    }
  },
};
