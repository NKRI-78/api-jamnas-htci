const axios = require('axios')
  
module.exports = {

    sendFCM: async (title, body, token, type) => {
        try {
            await axios.post('https://api-fcm-office.inovatiftujuh8.com/api/v1/firebase/fcm', {
                token: token,
                title: title,
                body: body,
                broadcast_type: type
            })
        } catch(e) {
            console.log(e)
        }
    },

    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    },

}