const conn = require('../configs/db')

module.exports = {

    getClub: () => {
        return new Promise((resolve, reject) => {
            var query = `SELECT no, club FROM clubs`
            conn.query(query, (e, result) => {
                if (e) {
                    reject(new Error(e))
                } else {
                    resolve(result)
                }
            })
        })
    },

}