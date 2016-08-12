/**
 * Created by JAY on 2016. 7. 18..
 */
var api = require('./../controllers/api.js');
var index = require('./../controllers/index.js');
var draw = require('./../controllers/draw.js');
var data = require('./../controllers/data.js');
var register = require('./../controllers/register.js');
var grid = require('./../controllers/grid.js');
var find = require('./../controllers/find.js');
var db = require('./../controllers/db.js');

module.exports = function (app) {

    app.get('/', index.index);

    // REST API, Register Monitor
    app.get('/api', api.index);

    // Drawing Dashboard
    app.post('/draw', draw.index);

    // Show Data
    app.post('/data', data.index);

    // Register Collect
    app.post('/register', register.index);

    // Draw Grid
    app.get('/grid', grid.index);

    // Inspect Data
    app.post('/find', find.index);

    // DB Connection
    app.post('/db', db.index);
}