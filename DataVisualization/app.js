var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var app = express();
var collect  = require('./util/collect.js');
var redis = require('./util/redis.js');
var mongo = require('./util/mongo.js');
var mysql = require('./util/mysql.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

require('./routes/routes')(app);


//trigger

//redis.getConnection("127.0.0.1");
mongo.connect("127.0.0.1");
//mysql.connect("192.168.0.202");

module.exports = app;
