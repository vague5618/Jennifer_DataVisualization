/**
 * Created by JAY on 2016. 8. 22..
 */

var uuid = require('node-uuid');
var ip = require('ip');
var urlManage = new Object();

module.exports.index = function (req, res) {

    if(req.query.type=='getChartInfo')
    {
        console.log(req.query.type);
        res.json(urlManage[req.params.id]);
    }

    else if(urlManage[req.params.id]!=null)
    {
        res.render('dashboard');
    }

    else {
        res.send(null);
    }
};

module.exports.create = function (req, res) {

    do{
        var timeBasedID = uuid.v1();

        var randomID = uuid.v4();

        var url = 'http://' + ip.address() + ':3000/dashboard/' + randomID;

        var chartInfo = JSON.parse(req.body['chartArray']);

        urlManage[randomID] = chartInfo;

    }while(urlManage[req.params.id]!=null);

    res.json(url);
};


