/**
 * Created by JAY on 2016. 8. 22..
 */

var uuid = require('node-uuid');
var ip = require('ip');
var chartDAO = require('../models/DAO/chartDAO');
var urlManage = new Object();
var layoutManage = new Object();

module.exports.index = function (req, res) {

    if(req.query.type=='getChartInfo')
    {
        chartDAO.find(req.params.id ,function(result)
        {
            res.json(result.value);
        });
    }
    else {

        chartDAO.find(req.params.id, function (result) {
            if (result != null) {
                res.render('dashboard', {title: "DashBoard"});
            }
            else
                res.send(null);
        });
    }
};

module.exports.create = function (req, res) {

    if(req.body.chartHash!=null) {

        var url = 'http://' + ip.address() + ':3000/dashboard/' + req.body.chartHash;

        var chartInfo = JSON.parse(req.body['chartArray']);
        var chartLayout = req.body.chartLayout;
        var obj = new Object();
        obj['chartInfo'] = chartInfo;
        obj['chartLayout'] = chartLayout;

        chartDAO.chartSave(req.body.chartHash, obj);

        res.json(url);
    }

    else{
        do {
            var timeBasedID = uuid.v1();

            var randomID = uuid.v4();

            var url = 'http://' + ip.address() + ':3000/dashboard/' + randomID;

            var chartInfo = JSON.parse(req.body['chartArray']);
            var chartLayout = req.body.chartLayout;
            var obj = new Object();
            obj['chartInfo'] = chartInfo;
            obj['chartLayout'] = chartLayout;

            urlManage[randomID] = obj;

            chartDAO.chartSave(randomID, obj);

        } while (urlManage[req.params.id] != null);

        res.json(url);
    }

};


