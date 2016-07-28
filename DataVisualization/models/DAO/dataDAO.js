/**
 * Created by JAY on 2016. 7. 28..
 */

var dataDTO = require('../DTO/dataDTO');

module.exports.save = function(data) {

    var newData = new dataDTO();
    newData.value = data;
    newData.collectTime = Date.now();
    newData.save();
};

module.exports.find = function(callback) {
    dataDTO.find({}, function (err, result) {

        console.log(result[0].collectTime);

    });
}


