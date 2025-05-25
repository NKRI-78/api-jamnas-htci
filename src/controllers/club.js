const misc = require("../helpers/response");

const Club = require('../models/Club');

module.exports = {

    getList: async (_, res) => {
        try {
            const clubs = await Club.getClub();
            
            misc.response(res, 200, false, "", clubs);
        } catch (e) {
            console.error(e);
            misc.response(res, 400, true, e.message);
        }
    },
    

}