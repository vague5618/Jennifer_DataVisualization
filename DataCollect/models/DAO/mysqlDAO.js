/**
 * Created by JAY on 2016. 8. 1..
 */

var mysql = require("../../util/mysql.js");
var connectManager = new Object();

module.exports.connection = function(req,res) {

    mysql.connect(req.body, function(connection)
    {
        connectManager[req.body.url] = connection;
    });
};

module.exports.query = function(ip, query, callback) {

    var connection = null;

    if(connectManager[ip]!=null) {

        connection = connectManager[ip];

        connection.query(query, function (err, result) {
            console.log(result);

            callback(result);
        });
    }
    else
        callback(null);
};

module.exports.getFields = function(query, callback) {

    var connection = mysql.getConnection();
    var ret = [];

    connection.query(query, function(err,result) {
        if (result != null) {

            for (var i = 0; i < result.length; i++) {
                ret.push(result[i].Field);
            }

            callback(ret);
        }
        else
            callback(null);
    });
};