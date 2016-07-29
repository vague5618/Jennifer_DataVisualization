/**
 * Created by JAY on 2016. 7. 18..
 */
var api = require('./../controllers/api.js');
var index = require('./../controllers/index.js');
var draw = require('./../controllers/draw.js');
var data = require('./../controllers/data.js');
var register = require('./../controllers/register.js');

module.exports = function (app) {

    app.get('/', index.index);

    // REST API, Register Monitor
    app.post('/api', api.index);

    // Drawing Dashboard
    app.post('/draw', draw.index);

    // Show Data
    app.post('/data', data.index);


    // Register Collect
    app.post('/register', register.index);

}