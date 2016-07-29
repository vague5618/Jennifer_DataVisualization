/**
 * Created by JAY on 2016. 7. 28..
 */

var dataDTO = require('../DTO/dataDTO');

module.exports.save = function(title, data, timeCheck) {

    var newData = new dataDTO();

    newData.title = title;

    newData.value = data;

    if(timeCheck==false)
        newData.collectTime = Date.now();

    newData.save();
};

module.exports.find = function(callback) {
    dataDTO.find({}, function (err, result) {

    });
}

module.exports.findOne = function(title, callback) {
    dataDTO.findOne({title : title}, function (err, result) {
            callback(result);
    });
}
