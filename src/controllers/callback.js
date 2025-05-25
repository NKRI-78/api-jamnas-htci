const misc = require("../helpers/response")
const Payment = require('../models/Payment')

module.exports = {

    callback: async (req, res) => {
        const { order_id, status } = req.body 

        try {

            if(status == "PAID") {
                await Payment.updatePaymentPaid(order_id)
            }

        } catch(e) {
            console.log(e)
            misc.response(res, 400, true, e.message)
        }
    }

}