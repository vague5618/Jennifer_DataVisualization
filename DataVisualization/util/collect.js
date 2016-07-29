/**
 * Created by JAY on 2016. 7. 19..
 */
var redis = require('../util/redis.js');
var dataDAO = require('../models/DAO/dataDAO.js');
var request = require('request');
var recordIntervals = {};

module.exports.checkCollect = function () {

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
                redis.updateValue(value, body, obj.formData);
            }
        });
    });
};

module.exports.collectURL = function (title, url, formData, interval, timeCheck) {

    //수집기에 대한 중복 요청이 접근시에

    if(recordIntervals[title]!=null)
        recordIntervals[title]._idleTimeout = interval;

    else {
        recordIntervals[title] = setInterval(function (title, url, formData, timeCheck) {

            request({
                url: url,
                qs: formData,
                method: 'GET',
            }, function (error, response, body) {
                if (error) {
                    console.error(error);
                } else {
                    //title, data, timeCheck
                    dataDAO.save(title, body, timeCheck);

                    //clearInterval(recordIntervals[title]);
                }
            });
        }, interval, title, url, formData, timeCheck);
    }
};