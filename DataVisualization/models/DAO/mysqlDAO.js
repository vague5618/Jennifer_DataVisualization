/**
 * Created by JAY on 2016. 8. 1..
 */

var mysql = require("../../util/mysql.js");

module.exports.connection = function(req,res) {
    mysql.connect(req.body);
};

module.exports.query = function(query, callback) {

    var connection = mysql.getConnection();

    connection.query(query,function(err,result)
    {
        callback(result);
    });
};

module.exports.getFields = function(query, callback) {

    var connection = mysql.getConnection();
    var ret = [];

    connection.query(query, function(err,result)
    {
        for(var i=0; i<result.length; i++)
        {
            ret.push(result[i].Field);
        }

        callback(ret);
    });
};