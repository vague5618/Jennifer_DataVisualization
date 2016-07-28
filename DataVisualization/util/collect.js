/**
 * Created by JAY on 2016. 7. 19..
 */
var redis = require('../util/redis.js');
var dataDAO = require('../models/DAO/dataDAO.js');
var request = require('request');


module.exports.startCollect = function () {

    setInterval(function () {
        redis.getAll("127.0.0.1", function (keys) {
            keys.forEach(collectData);
        });

    }, 500);
};

collectData = function (value) {

    redis.getValue(value, function (data) {
        var obj = JSON.parse(data);

        request({
            url: value,
            qs: obj.formData,
            method: 'GET',
        }, function (error, response, body) {
            if (error) {
                console.error(error);
            } else {
                dataDAO.save(body);
                redis.updateValue(value, body, obj.formData);
            }
        });
    });
};

