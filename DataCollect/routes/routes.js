/**
 * Created by JAY on 2016. 8. 24..
 */

var index = require('./../controllers/index.js');
var data = require('./../controllers/data.js');
var db = require('./../controllers/db.js');
var register = require('./../controllers/register.js');
var find = require('./../controllers/find.js');


module.exports = function (app) {
    app.get('/', index.index);

    app.post('/data', data.index);

    app.post('/db', db.index);

    app.post('/register', register.index);

    app.post('/find', find.index);
}