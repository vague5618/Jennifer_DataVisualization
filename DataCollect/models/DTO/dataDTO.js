/**
 * Created by JAY on 2016. 7. 27..
 */
var mongoose = require('mongoose');

var dataSchema = mongoose.Schema(
    {
        title : String,
        time : Number
    },
    {strict : false}
);

module.exports = mongoose.model('data', dataSchema);

