/**
 * Created by JAY on 2016. 8. 25..
 */

var mongoose = require('mongoose');

var chartSchema = mongoose.Schema(
    {
        _id : String,
        value : JSON,
        name : String,
        time : Number
    },
    { _id: false , strict: false}
);

module.exports = mongoose.model('chart', chartSchema);

