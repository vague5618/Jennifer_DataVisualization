/**
 * Created by JAY on 2016. 7. 18..
 */

var dataDAO = require('../models/DAO/dataDAO.js');

module.exports.index = function (req, res) {

    if(req.body.type=="showData" || req.body.type=="keys") {

        var title = req.body.title;

        dataDAO.findOne(title, function (result) {
            if (result == null)
                res.send(null);
            else {
                res.send(result);
            }
        });
    }

    if(req.body.type=="title")
    {
        dataDAO.getTitle(function (result) {
            if (result == null)
                res.send(null);
            else
                res.send(result);
        });
    }

    if(req.body.type=="distinct")
    {
        var field = req.body.field;

        dataDAO.getDistinct(field, function (result) {
            if (result == null)
                res.send(null);
            else
                res.send(result);
        });
    }
};


