var common = require('./common');

exports.editName = function(user_id, list_id, item_id, item_name){
  sql = "SELECT * FROM list_items WHERE id=" + common.connection.escape(item_id) + " AND list_id=" + common.connection.escape(list_id);
  common.connection.query(sql, function(err, rows){
    if( err || rows.length != 1){
      console.log(err);
    }
    else{      
      sql = "UPDATE list_items SET name = '" + item_name + "' WHERE id=" + common.connection.escape(item_id);
      common.connection.query(sql, function(err, result){
        if( err ){
            console.log(err);          
        }
        else{
          common.io.sockets.emit('itemname_update', { user_id: user_id, list_id: list_id, item_id: item_id, item_name: item_name });
//          sendAllUpdatedList(user_id, list_id, item_id);
        }
      });
    }
  });
}

exports.markItem = function(user_id, list_id, item_id){
  sql = "SELECT * FROM list_items WHERE id=" + common.connection.escape(item_id) + " AND list_id=" + common.connection.escape(list_id);
  common.connection.query(sql, function(err, rows){
    if( err || rows.length != 1){
      console.log(err);
    }
    else{      
      sql = "UPDATE list_items SET done = " + !rows[0].done + " WHERE id=" + common.connection.escape(item_id);
      common.connection.query(sql, function(err, result){
        if( err ){
            console.log(err);          
        }
        else{
          common.io.sockets.emit('itemdone_update', { user_id: user_id, list_id: list_id, item_id: item_id, item_done: rows[0].done });
          //sendAllUpdatedList(user_id, list_id, item_id);
        }
      });
    }
  });
}

exports.createItem = function(user_id, list_id, item_name){
  if( item_name === undefined || item_name == "" ){
    console.log("ERROR: Could not add item to list");
    return;
  }
  
  if( !item_name.match(common.letterNumberSpace) ){
    console.log("Item name has illegal characters");
    return;
  }
  
  var sql = "INSERT into list_items SET list_id=" + common.connection.escape(list_id) +
              ", user_id=" + common.connection.escape(user_id) +
              ", name=" + common.connection.escape(item_name);
  common.connection.query(sql, function(err, result){
    if( err){
      console.log("Problem with database");
    }
    else{
      sendAllUpdatedList(user_id, list_id, result.insertId);
    }
  });
}

sendAllUpdatedList = function(user_id, list_id, item_id){
  sql = "SELECT * FROM list_items WHERE list_id=" + common.connection.escape(list_id);
  common.connection.query(sql, function(err, rows){
    if( err ){
      console.log(err);
    }
    else{
      common.io.sockets.emit('list_update', { user_id: user_id, list_id: list_id, item_id: item_id, list_items: rows });
    }
  });
}