/**
 * Created by JAY on 2016. 8. 1..
 */
var mysql = require('mysql');
var connection;

module.exports.connect = function (obj, callback) {

    var url = null;
    if(obj.url!=null)
        url = obj.url;
    else
        url = obj.ip;

    var port = obj.port;
    var user = obj.user;
    var password = obj.password;
    var database = obj.database;

    connection = mysql.createConnection({
        host    : url,
        port : port,
        user : user,
        password : password,
        database: database
    });

    connection.connect(function(err) {
        if (err) {
            console.error('mysql connection error');
            console.error(err);
            callback(null);
        }

        else {
            console.log("mysql connection success");
            callback(connection);
        }
    });
}

module.exports.getConnection = function () {
    return connection;
}