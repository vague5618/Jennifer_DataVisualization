/**
 * Created by JAY on 2016. 7. 19..
 */
var dataDAO = require('../models/DAO/dataDAO.js');
var mysqlDAO = require('../models/DAO/mysqlDAO.js');
var request = require('request');
var jsonPath = require('JSONPath');
var moment = require( 'moment' );
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
    if (recordIntervals[title] != null)
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
                            obj[key] = jsonPath.eval(JSON.parse(body), collectTarget[key]);
                        }
                    }

                    dataDAO.save(title, obj, timeCheck);
                }
            });
        }, interval, title, url, formData, timeCheck);
    }
};

module.exports.collectDB = function (title, ip, table, formData, interval, timeCheck, collectTarget, timeType) {

    var keyList = collectTarget.keyList;
    var valueList = collectTarget.valueList;
    var timeColumn;
    var query = "select";
    var tookTime = 0;

    for (var i = 0; i < keyList.length; i++) {

        if (keyList[i] == 'time')
            timeColumn = valueList[i];

        if (i == keyList.length - 1)
            query += " " + valueList[i];
        else
            query += " " + valueList[i] + ",";
    }

    query += " from " + table;

    var nowTime = getTimeQuery(0,timeType);
    var fromTime =  getTimeQuery(-2,timeType);

    collect();

    function collect() {

        nowTime = getTimeQuery(0,timeType);

        var tempQuery = getQuery(fromTime, nowTime, timeType, query, timeColumn);

        var pre_query = new Date().getTime();

        mysqlDAO.query(ip, tempQuery, function (result) {

            var post_query = new Date().getTime();

            if(result!=null) {

                for (var i = 0; i < result.length; i++) {
                    var obj = new Object();

                    for (var j = 0; j < keyList.length; j++) {
                        obj[keyList[j]] = result[i][valueList[j]];
                    }

                    dataDAO.save(title, obj, timeCheck);
                }
            }

            tookTime = (post_query - pre_query);

            fromTime = nowTime;

            setTimeout(collect(title), 1000000 - tookTime);
        });
    }
};

function getTimeQuery(minute, timeType) {
    switch (timeType) {
        case 'Timestamp':
            return (0).day().fromNow().addMinutes(minute).getTime();
            break;
        case 'Date':
            return (0).day().fromNow().addMinutes(minute);
            break;
    }
}

function getQuery(startTime, endTime, timeType, query, timeColumn) {
    switch (timeType) {
        case 'Timestamp':
            return query + " where " + timeColumn + " <= " + endTime +
            " and " + timeColumn + " > " + startTime;
            break;
        case 'Date':
            return query + " where " + timeColumn
                + " <= '" + moment(endTime).format("YYYY-MM-DD HH:mm:ss")
                + "' and " + timeColumn
                + " > '" + moment(startTime).format("YYYY-MM-DD HH:mm:ss")+"'";
            break;
    }
}

