/**
 * Created by JAY on 2016. 7. 19..
 */
var request = require('request');
var mysqlDAO = require('../models/DAO/mysqlDAO.js');

module.exports.index = function (req, res) {

    mysqlDAO.connection(req);

    mysqlDAO.getFields("show columns from "+req.body.table, function(result)
    {
        res.send(result);
    });
};