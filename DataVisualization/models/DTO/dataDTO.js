/**
 * Created by JAY on 2016. 7. 27..
 */
var mongoose = require('mongoose');

var dataSchema = mongoose.Schema(
    {
        title : String,
        value: JSON,
        collectTime : Number
    }
);

module.exports = mongoose.model('data', dataSchema);

