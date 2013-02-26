var express = require('express')
    , cfg = require("./config")
    , http = require('http')
    , path = require('path');

var app = express();

app.configure('development', function(){
    // 启用本地数据库
    cfg.start(true);
    app.use(express.errorHandler());
    console.log('development');
});

app.configure('production', function(){
    // 启用远程数据库
    cfg.start();
    console.log('production');
});


app.configure(function(){
    app.set('port', process.env.PORT || cfg.ports.remote);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({secret: "keyboard cat", maxAge: 12000}));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});


var routes = require('./routes');
app.all('*',routes.login);
app.all('/', routes.index);
// app.all('/login', routes.login);
// app.all('/logout', routes.logout);
// app.all('/adduser', routes.add);
app.all('/addbook', routes.addbook);
app.all('/savebook', routes.savebook);
app.all('/updatebook', routes.updatebook);

http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
});
