/**
 * Created by JAY on 2016. 7. 19..
 */
var request = require('request');

module.exports.index = function(req, res) {

    var obj = req.body;

    var url = obj.url;

    delete obj.url;

    request({
        url: url,
        qs: obj,
        method: 'GET',
    }, function(error, response, body){
        if(error) {
            console.log(error);
        } else {
            res.send(body);
        }
    });
};