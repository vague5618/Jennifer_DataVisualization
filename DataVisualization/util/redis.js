/**
 * Created by JAY on 2016. 7. 18..
 */

var redis = require('redis');
var async = require("async");
var client = null;

module.exports.getConnection = function(url){

    client = redis.createClient(6379,url);

    client.on('error', function(error)
    {
        console.error("error in redis : "+error);

    });
};

module.exports.setValue = function(key, value, formData, url)
{
    if(client == null)
        client = this.getConnection(url);

    var obj = new Object();

    obj['value'] = value;

    obj['formData'] = formData;

    client.set(key, JSON.stringify(obj), redis.print);
}

module.exports.setExpire = function(key, time)
{
    if(client == null)
        client = this.getConnection(url);

    client.expire(key, time);
}

module.exports.getValue = function(key, callback, url)
{
    if(client == null)
        client = this.getConnection(url);

    client.get(key, function(err, result){
        callback(result);
    });
}

module.exports.getAll = function(url, callback)
{
    if(client == null)
        client = this.getConnection(url);

    client.keys('*', function (err, keys)
    {
        callback(keys);
    });
}

module.exports.delValue = function(key, url)
{
    if(client == null)
        client = this.getConnection(url);

    client.del(key,redis.print);
}

module.exports.updateValue = function(key, value, formData)
{
    async.waterfall([
        function (callback) {
            client.ttl(key, function(err, data) {
                callback(null, data);
            });
        },
    ], function (err, result) {

            if(result==-2)
                return;
            else {

                var obj = new Object();
                obj['value'] = value;
                obj['formData'] = formData;

                client.setex(key, result, JSON.stringify(obj));
            }
    });
}

module.exports.existKey = function(key,callback)
{
    client.exists(key, function (err, doesExist) {
        callback(doesExist);
    });
}


