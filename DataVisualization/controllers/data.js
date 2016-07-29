/**
 * Created by JAY on 2016. 7. 19..
 */
var request = require('request');

module.exports.index = function (req, res) {

    console.log(req.body);

    var formData = req.body;

    var url = formData.url;

    delete formData.url;
    delete formData.timeCheck;
    delete formData.interval;

    request({
        url: url,
        qs: formData,
        method: 'GET',
    }, function (error, response, body) {
        if (error) {
            console.log(error);
        } else {
            res.send(body);
        }
    });
};