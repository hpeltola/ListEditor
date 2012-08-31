var mysql = require('mysql');

var list = require('./list');
var item = require('./item');
var user = require('./user');


var common = require('./common');


// Setup websockets
exports.setIO = common.setIO;
exports.setIOConnection = function(){
  common.io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('item', function (data) {  
      console.log(data);
      if( data.type == "mark_item" ){
        item.markItem(data.user_id, data.list_id, data.item_id);
      }
      else if( data.type == "new_item" ){
        item.createItem(data.user_id, data.list_id, data.item_name, data.item_type_id);
      }
      else if( data.type == "edit_name" ){
       item.editName(data.user_id, data.list_id, data.item_id, data.item_name);
      }
      else if( data.type == "edit_item_type"){
       item.editItemType(data.user_id, data.list_id, data.item_id, data.item_type_id); 
      }
    });
    socket.on('list', function(data){
      if( data.type == "updateName" ){
        list.updateName(data.user_id, data.list_id, data.list_name);
      }
    });
  });
}

// User functions
exports.registerForm = user.registerForm;
exports.register = user.register;
exports.getUser = user.getUser;
exports.modifyUser = user.modifyUser;
exports.deleteUser = user.deleteUser;

// List functions
exports.getLists = list.getLists;
exports.getList = list.getList;
exports.editList = list.getList;
exports.createList = list.createList;



exports.login = function(req,res){

  var post = req.body;
  var sql = 'SELECT * FROM users WHERE username = ? && password = ?';
  common.connection.query(sql,[post.username, post.password],function(err, rows){
    if( err ){
      console.log(err);
      res.render('error', {title: "Error", message: 'Bad username/password'});
    }
    else if( rows.length != 1 ){
      res.render('error', {title: "Error", message: 'Bad username/password'});
    }
    else{
      console.log("Logged in user: " + rows[0].username);
      req.session.user_id = rows[0].id;
      req.session.username = rows[0].username;
      req.session.firstname = rows[0].firstname;
      req.session.lastname = rows[0].lastname;
      req.session.email = rows[0].email;
      res.redirect('/');
    }
  });
};

exports.logout = function(req, res){
  delete req.session.user_id;
  res.redirect('/');
};


exports.home = function(req,res){
  
  common.io.sockets.emit('news', { hello: 'home page opened' }); 
  
  var user_id = req.session.user_id;
  res.render('home', { title: "Home", user_id: user_id });
};


exports.checkAuth = function(req, res, next) {
  if (!req.session.user_id) {
    res.render('error', {title: "Error", message: 'You are not authorized to view this page', user: null});
  } else {
    var auth_username = req.session.username;
    var auth_user_id = req.session.user_id;
    next();
  }
}