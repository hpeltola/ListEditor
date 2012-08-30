var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
var io = require('socket.io').listen(server);

var routes = require('./routes');


routes.setIO(io);
routes.setIOConnection();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.favicon());
app.use(express.bodyParser());
app.use(express.cookieParser('nota'));
app.use(express.session());


app.use(function(err, req, res, next){
  console.error(err.stack);
  res.send(500, 'Something broke!');
});


// Routes
app.get('/', routes.home);
app.post('/login', routes.login);
app.get('/logout', routes.logout);

app.get('/register', routes.registerForm);
app.post('/register', routes.register);

// User
app.get('/user', routes.checkAuth, routes.getUser);
app.post('/user', routes.checkAuth, routes.modifyUser);
app.delete('/user', routes.checkAuth, routes.deleteUser);

// List
app.get('/list', routes.checkAuth, routes.getLists);
app.get('/list/:list_id', routes.checkAuth, routes.getList);
app.post('/list', routes.checkAuth, routes.createList);
app.get('/list/:list_id/edit', routes.checkAuth, routes.editList);

// Item
app.post('/list/:list_id/item', routes.checkAuth, routes.createListItem);

//app.listen(5000);
server.listen(5000, function(){
  console.log('Listening on port 5000');
});