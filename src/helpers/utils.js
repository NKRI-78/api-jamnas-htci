const axios = require("axios");

module.exports = {
  sendFCM: async (title, body, token, type) => {
    try {
      await axios.post(
        "https://api-fcm-office.inovatiftujuh8.com/api/v1/firebase/fcm",
        {
          token: token,
          title: title,
          body: body,
          broadcast_type: type,
        }
      );
    } catch (e) {
      console.log(e);
    }
  },

  templateStoreMp: (
    invoiceValue,
    totalAmount,
    paymentCode,
    paymentExpire,
    paymentType,
    paymentAccess
  ) => {
    var template = `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2>Invoice Payment</h2>
          <p>Hi,</p>
          <p>Thank you for your order. Here are your payment details:</p>
          <table style="border-collapse: collapse; width: 100%;">
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Order ID</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${invoiceValue}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Amount</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${this.formatCurrency(
                totalAmount
              )}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Payment Method</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${paymentCode.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Payment Expiration</td>
              <td style="padding: 8px; border: 1px solid #ddd;">${paymentExpire}</td>
            </tr>
          </table>
          <p style="margin-top: 20px;">
            ${
              paymentType === "emoney"
                ? `<a href="${paymentAccess}" style="padding: 10px 20px; background-color: #E91E63; color: #fff; text-decoration: none;">Pay Now</a>`
                : `Please pay to Virtual Account Number: <strong>${paymentAccess}</strong>`
            }
          </p>
          <p>If you have any questions, please contact our support.</p>
          <p>Best regards,<br/>MerahPutih Team</p>
        </div>
      `;
    return template;
  },

  sendEmail: async (app, email, body) => {
    try {
      const response = await axios.post(
        "https://api-email.inovatiftujuh8.com/api/v1/email",
        {
          to: email,
          app: app,
          subject: "Pembayaran",
          body: body,
          type: "payment-merah-putih",
        }
      );
      if (response.status == 200) {
        console.log("Send E-mail Success");
      }
    } catch (e) {
      console.log(e);
    }
  },

  formatCurrency(amount) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  },
};
