/**
 * Created by JAY on 2016. 7. 28..
 */

var dataDTO = require('../DTO/dataDTO');
var async = require('async');
require('datejs');


module.exports.save = function (title, data, timeCheck) {

    var newData = new dataDTO(data);

    newData.title = title;

    if (timeCheck == 'false' || data['time'] == null) {
        newData.time = new Date().getTime();
    }

    else
    {
        //수정필요

        //만약 time객체가 Date라면 -> timestamp
        if (typeof(data['time'][0]) == "object")
            newData.time = data['time'].getTime();

        //만약 time객체가 string이라면
        else if (typeof(data['time'][0]) == "string")
            newData.time = Number(data['time']);
    }

    newData.save();
};

module.exports.find = function (title, timeColumn, getTime, callback) {

    var query = {};
    query["title"] = title;
    query[timeColumn] = {$gt: (0).day().fromNow().addSeconds(-1*getTime).getTime()};

    dataDTO.find(query, function (err, result) {
        callback(result);
    });
}

module.exports.getOne = function (title, timeColumn, getTime, callback) {

    var query = {};
    query[timeColumn] = -1;

    dataDTO.findOne({title : title}).sort(query).exec(function(err, result) {
        callback(result);
    });
}


module.exports.findOne = function (title, callback) {
    dataDTO.findOne({title: title}, function (err, result) {
        callback(result);
    });
}

module.exports.getTitle = function (callback) {

    dataDTO.distinct("title", function (err, result) {
        callback(result);
    });
}

module.exports.getDistinct = function (field, callback) {
    dataDTO.distinct(field, function (err, result) {
        callback(result);
    });
}

module.exports.getHourData = function (title, timeColumn, valueColumn, howLong, callback) {

    var ret = [];

    for(var i=0; i<(24*60/howLong); i++)
    {
        ret[i] = 0;
    }

    async.waterfall([
            function (callback) {
                //get TodayData
                //title, timeColumn, valueColumn, start, end, howLong, ret, callback

                query(title, timeColumn, valueColumn,
                    Date.today().getTime(), (0).day().fromNow().getTime(), howLong, ret, callback);
            },

            function (callback) {
                //get YesterdayData
                //title, timeColumn, valueColumn, start, end, howLong, ret, callback
                query(title, timeColumn, valueColumn,
                    (-1).day().fromNow().getTime(), Date.today().getTime(), howLong, ret, callback);
            }],

        function (err, result) {

            console.log("1day length : " + ret.length);

            callback(ret);
        }
    );
}


module.exports.getMinuteData = function (title, timeColumn, valueColumn, howLong, callback) {

    var ret = [];

    async.waterfall([
            function (callback) {
                //get TodayData
                //title, timeColumn, valueColumn, start, end, howLong, ret, callback
                query(title, timeColumn, valueColumn,
                    (0).day().fromNow().addMinutes(-1*howLong).getTime(), (0).day().fromNow().getTime(), howLong, ret, callback);
            }],
        function (err, result) {

            console.log("mintue Mean length : "+ret.length);

            callback(ret[ret.length-1]);
        }
    );
}


module.exports.createData = function () {
    var start = (-1).day().fromNow();
    var current = (0).day().fromNow();
    var lim = Date.today();


    while (start < current) {
        var obj = new Object();

        if(start < lim)
        {
            obj['tps'] = 0;
        }
        else
        {
            obj['tps'] = 1;
        }

        //obj['tps'] = [Math.random()];

        var newData = new dataDTO(obj);

        newData.title = "createTEST";

        newData.time = start.addMinutes(1).getTime();

        newData.save();
    }
}

module.exports.removeData = function () {
    dataDTO.remove({}, function () {
    });
}

function query(title, timeColumn, valueColumn, start, end, howLong, ret, callback)
{
    dataDTO.aggregate([
        {
            $match : {title : title, time: {$lte: end , $gt: start}}
        },
        {
            "$project": {
                "date": { "$add": [new Date(0), "$"+timeColumn] },
                "list": "$"+valueColumn
            }
        },
        {
            $group : {
                "_id": {
                    "hour" : {
                        $hour : "$date"
                    },
                    "minute" : {
                        $subtract:
                            [
                                {
                                    $minute: '$date'
                                },
                                {
                                    $mod : [{$minute : '$date'}, howLong]
                                }
                            ]
                    }
                },

                "list": {$push: '$list'}
            }
        },
        {
            $sort: {
                "_id.hour": 1,
                "_id.minute": 1
            }
        }
    ], function (err, result) {

        for (var i = 0; i < result.length; i++) {

            var tempIndex = getTimeToIndex((result[i]._id.hour + 9) % 24, result[i]._id.minute, howLong);

            var tempMean = mean(result[i].list);

            ret[tempIndex] = tempMean;
        }

        callback(null);
    });
}

function mean(arr) {

    var ret = [];

    if(typeof(arr)=='object');
    {
        for (var i = 0; i < arr.length; i++) {

            var sum = 0;

            sum += arr[i];
        }

        ret.push(sum / arr.length);
    }

    return ret;
}

function getTimeToIndex(tempHour, tempMinute, howLong) {
    return tempHour * (60 / howLong) + (tempMinute / howLong);
}

