/**
 * Created by JAY on 2016. 7. 27..
 */
var mongoose = require('mongoose');

var collectSchema = mongoose.Schema(
    {
        _id: { type: String},
        content : JSON
    },
    {_id:false, strict : false}
);

module.exports = mongoose.model('collect', collectSchema);

