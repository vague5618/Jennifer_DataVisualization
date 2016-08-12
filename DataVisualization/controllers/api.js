/**
 * Created by JAY on 2016. 7. 18..
 */

var dataDAO = require('../models/DAO/dataDAO.js');

module.exports.index = function (req, res) {

    var json = req.query;
    var title = json.title;
    var timeColumn = json.timeColumn;
    var time = json.time;
    var value = json.value;
    var type = json.type;

    if (type == "5minute") {    //title, timeColumn, minutes, callback
        dataDAO.find(title, timeColumn, time, function (result) {
            res.send(result);
        });
    }

    if (type == "1day") {
        dataDAO.getHourData(title, timeColumn, value, function (result) {
            res.send(result);
        });
    }

    if (type == "5minuteMean") {

        //title, timeColumn, valueColumn
        dataDAO.getFiveData(title, timeColumn, value, function (result) {
            res.send(result);
        });
    }
};


