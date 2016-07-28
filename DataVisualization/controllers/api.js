/**
 * Created by JAY on 2016. 7. 18..
 */

var redis = require('../util/redis.js');
//var url = "http://support.jennifersoft.com:8000/api/realtime/domain";

module.exports.index = function (req, res) {

    var json = req.body;
    var url = json.url;
    var formData = JSON.parse(json.formData);

    redis.existKey(url, function (check) {
        //존재하지 않는다면 등록
        if (check == false) {
            redis.setValue(url, "", formData);

            redis.setExpire(url, 300);
        }

        redis.getValue(url, function (result) {

            var obj = JSON.parse(result);

            if (obj.value == "")
                res.status(200).send(false);
            else
                res.send(JSON.parse(obj.value));
        });
    });
};


