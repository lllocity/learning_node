
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs   = require('fs')
  , si   = require('socket.io');

var app = express();

var json_file = '/var/www/test/json/sample.json';

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
  app.locals.pretty = true;
});

// app.get('/', routes.index);
app.get('/', function(req, res){
    res.render('index', {
        title: 'Log Watch',
        server: '192.168.11.7',
        port: 3000
    });
});

app.get('/users', user.list);

// ファイルの監視
fs.stat(json_file, function(err, stat){
    if(err){ throw err; }

    if(! stat.isFile() ){
        console.error( json_file, ' is not file' );
        process.exit(1);
    }

    fs.watchFile(json_file, { interval: 500 }, function (curr, prev) {
        fs.readFile(json_file, 'utf8', function (err, json_data) {
            // if (err) { throw err; }
            io.sockets.emit('change', json_data);
        });
    });
});

var server = http.createServer(app);
var io = si.listen(server);

server.listen(3000);
