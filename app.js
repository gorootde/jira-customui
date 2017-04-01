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
