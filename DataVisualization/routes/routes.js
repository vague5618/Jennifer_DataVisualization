/**
 * Created by JAY on 2016. 7. 18..
 */
var api = require('./../controllers/api.js');
var index = require('./../controllers/index.js');

var register = require('./../controllers/register.js');
var find = require('./../controllers/find.js');
var dashboard = require('./../controllers/dashboard.js');

module.exports = function (app) {

    app.get('/', index.index);

    app.post('/', index.post);

    app.get('/&modify*', index.index);

    // REST API, Register Monitor
    app.get('/api', api.index);

    // Register Collect
    app.post('/register', register.index);

    // Inspect Data
    app.post('/find', find.index);

    app.post('/dashboard/create', dashboard.create);

    app.get('/dashboard/:id', dashboard.index);
}