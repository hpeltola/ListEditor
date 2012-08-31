var common = require('./common');

exports.getLists = function(req, res){

  var user_id = req.session.user_id;
  // GET ALL Lists
  sql = "SELECT * FROM lists";
  common.connection.query(sql, function(err, rows){
    if( err ){
      console.log(err);
      res.render('error', {title: "Error", message: "Problem getting lists from database", user_id: user_id});
    }
    else{
      console.log(rows);
      res.render('getLists', {title: "Lists", 
                          lists: rows,
                          user_id: user_id});
    }
  });
};

exports.getList = function(req, res){
  var user_id = req.session.user_id;
  var list_id = req.params.list_id;

  sql = "SELECT * FROM lists WHERE id=" + common.connection.escape(list_id);
  common.connection.query(sql, function(err, list){
    if( err ){
      console.log(err);
      res.render('error', {title: "Error", message: "Problem getting list from database", user_id: user_id});
    }
    else if( list.length != 1 ){
      res.render('error', {title: "Error", message: "List was not found.", user_id: user_id});
    }
    else{ 
      sql = "SELECT * FROM list_items WHERE list_id=" + common.connection.escape(list_id);
      common.connection.query(sql, function(err, rows){
        if( err ){
          console.log(err);
          res.render('error', {title: "Error", message: "Problem getting list_items from database", user_id: user_id});
        }
        else{
          sql = "SELECT * FROM list_item_types";
          common.connection.query(sql, function(err, types){
            if( err ){
             console.log(err);
             res.render('error', {title: "Error", message: "Problem getting list_item_typess from database", user_id: user_id});
            }
            else{  
              console.log(types);
              if( req.route.path == "/list/:list_id"){
                // This is the normal view
                res.render('getList', {title: "List items", 
                                      list_name: list[0].name,
                                      list_items: rows,
                                      list_id: list_id,
                                      list_item_types: types,
                                      user_id: user_id});
              }
              else if( req.route.path == "/list/:list_id/edit"){
                // This is the edit view
                res.render('editList', {title: "List items", 
                                        list_name: list[0].name,
                                        list_items: rows,
                                        list_id: list_id,
                                        list_item_types: types,
                                        user_id: user_id});
              }
            }
          });
        }
      });
    }
  });
};



exports.createList = function(req, res){
  var user_id = req.session.user_id;
  var listname = req.body.listname;
  console.log(req.body);

  if( !listname.match(common.letterNumberSpace) ){
    res.render('error', {title: "Error", message: "List name has illegal characters", user_id: user_id});
    return;
  }
  
  sql = "INSERT into lists SET user_id=" + common.connection.escape(user_id) + ", name=" + common.connection.escape(listname);
  common.connection.query(sql, function(err, result){
    if( err ){
      res.render('error', {title: "Error", message: "Problem with database", user_id: user_id});
    }
    else{
      res.redirect('/list');
    }
  });
};

exports.updateName = function(user_id, list_id, list_name){
  
  var sql = "UPDATE lists SET name = " + common.connection.escape(list_name) + " WHERE id=" + common.connection.escape(list_id);
  common.connection.query(sql, function(err, result){
    if( err ){
        console.log(err);          
    }
    else{
      console.log({ user_id: user_id, list_id: list_id, list_name: list_name });
      common.io.sockets.emit('listname_update', { user_id: user_id, list_id: list_id, list_name: list_name });
    }
  });
};