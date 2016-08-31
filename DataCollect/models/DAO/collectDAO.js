/**
 * Created by JAY on 2016. 8. 30..
 */
var collectDTO = require('../DTO/collectDTO');

module.exports.save = function (title, data) {

    delete data.title;

    var newData = new collectDTO(data);

    newData._id = title;

    newData.save(function(err,result)
    {
        if(err)
        {
            collectDTO.update({_id: title}, data, function(err, numberAffected, rawResponse) {
                console.log(numberAffected);
            })
        }

    });
};

module.exports.find = function(callback) {
    collectDTO.find({}, function (err, result) {
        callback(result);
    });
}