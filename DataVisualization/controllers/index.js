/**
 * Created by JAY on 2016. 7. 18..
 */

var chartDAO = require('../models/DAO/chartDAO');

module.exports.index = function (req, res){
    res.render('index', {title: 'TEST'});
};

module.exports.post = function (req, res) {

    chartDAO.find(req.body.hash,function(result)
    {
        res.send(result);
    });
};