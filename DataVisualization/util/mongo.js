/**
 * Created by JAY on 2016. 7. 27..
 */
var mongoose    = require('mongoose');
var test  = require('../models/DTO/dataDTO.js');
var db = mongoose.connection;

// CONNECT TO MONGODB SERVER
db.on('error', console.error);

db.once('open', function(){
    console.log("Connected to mongod server");
});

module.exports.connect = function (url) {
    mongoose.connect(url);
}
