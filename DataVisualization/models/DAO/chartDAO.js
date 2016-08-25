/**
 * Created by JAY on 2016. 8. 25..
 */
var chartDTO = require('../DTO/chartDTO');

module.exports.chartSave = function(hash, value)
{
    var newData = new chartDTO();

    newData._id = hash;
    newData.value = value;

    newData.save(function(err)
    {
        if(err)
        {
            chartDTO.update({_id: hash}, {
                value: value
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