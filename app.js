//-
//-     Copyright (C) 2017  Michael Kolb
//-
//-     This program is free software: you can redistribute it and/or modify
//-     it under the terms of the GNU General Public License as published by
//-     the Free Software Foundation, either version 3 of the License, or
//-     (at your option) any later version.
//-
//-     This program is distributed in the hope that it will be useful,
//-     but WITHOUT ANY WARRANTY; without even the implied warranty of
//-     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//-     GNU General Public License for more details.
//-
//-     You should have received a copy of the GNU General Public License
//-     along with this program.  If not, see <http://www.gnu.org/licenses/>.

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var session = require('cookie-session')

var index = require('./routes/index');
var login = require('./routes/login');
var jira = require('./routes/jira');


var User = require('./app/models/user');
var CredentialCache = require('./app/models/credentialcache');


var app = express();

app.locals.md = require('marked').setOptions({ breaks: true });
app.locals.j2md = require('jira2md').to_markdown;
app.locals.moment = require('moment');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // redirect bootstrap JS
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist')); // redirect JS jQuery
app.use('/js', express.static(__dirname + '/node_modules/datatables.net/js'));
app.use('/js', express.static(__dirname + '/node_modules/datatables.net-bs/js'));
app.use('/js', express.static(__dirname + '/node_modules/datatables.net-colreorder/js'));
app.use('/js', express.static(__dirname + '/node_modules/datatables.net-fixedheader/js'));

app.use('/js', express.static(__dirname + '/node_modules/bootstrap-select/dist/js'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap-select/dist/css'));

app.use('/css', express.static(__dirname + '/node_modules/datatables.net-bs/css'));

app.use('/css', express.static(__dirname + '/node_modules/datatables.net-colreorder-bs/css'));
app.use('/css', express.static(__dirname + '/node_modules/datatables.net-fixedheader-bs/css'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); // redirect CSS bootstrap
app.use('/fonts', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); // redirect CSS bootstrap
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: "foobar"
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions



app.use('/', index);
app.use('/auth', login);
app.use('/api/jira', jira);








// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.render('error', {
        error: err
    });
});

app.listen(3000, function() {
    console.log("Listening on port 3000");
});
module.exports = app;
