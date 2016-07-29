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

    delete formData.title;
    delete formData.url;
    delete formData.interval;
    delete formData.timeCheck;

    //(title, url, formData, interval, timeCheck)
    collect.collectURL(title, url, formData, interval, timeCheck);

    dataDAO.findOne(title, function(result)
    {
        if(result==null)
            res.send(null);
        else
            res.send(result.value);
    });
};


