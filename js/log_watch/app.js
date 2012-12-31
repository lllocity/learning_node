
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs   = require('fs')
  , socketio = require('socket.io');

var app = express();

var log_file = '/var/www/test/logs/access.log';

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
fs.open(log_file, "r", "0666",function(err,fd){
    if(err){ throw err; }

    //1秒ごとにファイルを見てファイルサイズに差が会ったら差分出力
    fs.watchFile(log_file, {interval:1000}, function(cur, prev){
        // if(+cur.mtime !== +prev.mtime){
        if(cur.size !== prev.size){  // !==だとローテート時にまずいかな
        var buf_size = 1024;

            for(var pos=prev.size; pos<cur.size; pos+=buf_size){
                if(err){ throw err; }

                var buf = new Buffer(buf_size);
                fs.read(fd, buf, 0, buf_size, pos,
                    function(err, bytesRead, buffer){
                        var log = buffer.toString('utf8', 0, bytesRead);
                        // changeをログの内容つけて送信する
                        io.sockets.emit('change', log);
                    }
                );
            }
        }
    });
});

var server = http.createServer(app);
var io = socketio.listen(server);

server.listen(3000);
