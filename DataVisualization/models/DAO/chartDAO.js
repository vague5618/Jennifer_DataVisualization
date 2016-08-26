/**
 * Created by JAY on 2016. 8. 25..
 */
var chartDTO = require('../DTO/chartDTO');

module.exports.chartSave = function(hash, name, value)
{
    var newData = new chartDTO();
    var time = new Date().getTime();

    newData._id = hash;
    newData.value = value;
    newData.name = name;
    newData.time = time;

    newData.save(function(err)
    {
        if(err)
        {
            chartDTO.update({_id: hash}, {
                value: value, name : name, time : time
            }, function(err, numberAffected, rawResponse) {
            })
        }
    });
}

module.exports.find = function(hash, callback) {

    chartDTO.findOne({_id: hash}, function (err, result) {
        callback(result);
    });
}

module.exports.getTitle = function(callback) {

    chartDTO.find({}, function (err, result) {
        callback(result);
    });
}