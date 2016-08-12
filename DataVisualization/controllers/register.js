/**
 * Created by JAY on 2016. 7. 18..
 */

var collect = require('../util/collect.js');
var dataDAO = require('../models/DAO/dataDAO.js');


module.exports.index = function (req, res) {

    var formData = req.body;

    var title = formData.title;
    var url = formData.url;
    var interval = formData.interval;
    var timeCheck = formData.timeCheck;
    var type = formData.type;
    var collectTarget = JSON.parse(formData.collectTarget);

    delete formData.title;
    delete formData.url;
    delete formData.interval;
    delete formData.timeCheck;
    delete formData.type;

    if(type=="URL") {
        //(title, url, formsData, interval, timeCheck, collectTarget)
        collect.collectURL(title, url, formData, interval, timeCheck, collectTarget);

        dataDAO.findOne(title, function (data) {
            res.send(data);
        });
    }

    if(type=="DB")
    {
        var table = formData.table;

        //title, table, formData, interval, timeCheck, collectTarget
        collect.collectDB(title, table, formData, interval, timeCheck, collectTarget);
        res.send(null);
    }
};


