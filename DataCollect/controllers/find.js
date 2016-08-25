/**
 * Created by JAY on 2016. 8. 24..
 */
/**
 * Created by JAY on 2016. 7. 18..
 */

var dataDAO = require('../models/DAO/dataDAO.js');

module.exports.index = function (req, res) {
    if(req.body.type=="title")
    {
        dataDAO.getTitle(function (result) {
            if (result == null)
                res.send(null);
            else
                res.send(result);
        });
    }
};


