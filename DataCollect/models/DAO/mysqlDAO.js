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


module.exports.connectDB = function(ip, user, password, port, database, callback) {

    var obj = new Object();
    var list = getArgs(this.connectDB);

    for(var i=0; i<list.length; i++)
    {
        obj[list[i]] = arguments[i];
    }

    mysql.connect(obj, function(connection)
    {
        if(connection==null)
            callback(null);

        connectManager[ip] = connection;

        callback(connection);
    });
};

module.exports.query = function(ip, query, callback) {

    var connection = null;

    if(connectManager[ip]!=null) {

        connection = connectManager[ip];

        connection.query(query, function (err, result) {

            if(err) {
                console.log("mysqlDAO");
                console.err(err);
                callback(null);
            }
            else
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

function getArgs(func) {
    var args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

    return args.split(',').map(function(arg) {
        return arg.replace(/\/\*.*\*\//, '').trim();
    }).filter(function(arg) {
        return arg;
    });
}
