/**
 * Created by JAY on 2016. 7. 19..
 */
var redis = require('../util/redis.js');
var dataDAO = require('../models/DAO/dataDAO.js');
var mysqlDAO = require('../models/DAO/mysqlDAO.js');
var request = require('request');
var jsonPath = require ('JSONPath');
require('datejs');
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

module.exports.collectURL = function (title, url, formData, interval, timeCheck, collectTarget) {


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
                    var obj = new Object();

                    for (var key in collectTarget) {
                        if (collectTarget.hasOwnProperty(key)) {
                            obj[key] = jsonPath.eval(JSON.parse(body),collectTarget[key]);
                        }
                    }

                    dataDAO.save(title, obj, timeCheck);
                }
            });
        }, interval, title, url, formData, timeCheck);
    }
};

module.exports.collectDB = function (title, table, formData, interval, timeCheck, collectTarget) {


    var index = 0;
    var keyList = collectTarget.keyList;
    var valueList = collectTarget.valueList;
    var timeColumn;
    var query = "select";


    for(var i=0; i<keyList.length; i++) {

        if(keyList[i]=='time')
            timeColumn = valueList[i];

        if(i==keyList.length-1)
            query += " " + valueList[i];
        else
            query += " " + valueList[i]+",";
    }

    query+=" from "+table;


    //수집기에 대한 중복 요청이 접근시에
    if(recordIntervals[title]!=null)
        recordIntervals[title]._idleTimeout = interval;

    else {

        recordIntervals[title] = setInterval(function (title, table, formData, timeCheck) {

            var tempQuery = query+" where "+ timeColumn +" <= " + (0).day().fromNow().getTime() +
                " and "+timeColumn+" > " + (0).day().fromNow().addSeconds(-2).getTime();

            console.log(tempQuery);

            mysqlDAO.query(tempQuery,function(result)
            {
                console.log(result);

                for(var i=index; i<result.length; i++)
                {
                    var obj = new Object();

                    for(var j=0; j<keyList.length; j++)
                    {
                        obj[keyList[j]] = result[i][valueList[j]];
                    }

                    dataDAO.save(title, obj, timeCheck);
                }

                index = result.length;
            });

        }, interval, title, table, formData, timeCheck);
    }
};

