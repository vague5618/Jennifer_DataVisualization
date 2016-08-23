/**
 * Created by JAY on 2016. 7. 18..
 */
var api = require('./../controllers/api.js');
var index = require('./../controllers/index.js');
var data = require('./../controllers/data.js');
var register = require('./../controllers/register.js');
var find = require('./../controllers/find.js');
var db = require('./../controllers/db.js');
var dashboard = require('./../controllers/dashboard.js');

module.exports = function (app) {

    app.get('/', index.index);

    // REST API, Register Monitor
    app.get('/api', api.index);

    // Show Data
    app.post('/data', data.index);

    // Register Collect
    app.post('/register', register.index);

    // Inspect Data
    app.post('/find', find.index);

    // DB Connection
    app.post('/db', db.index);

    app.post('/dashboard/create', dashboard.create);

    app.get('/dashboard/:id', dashboard.index);
}