var mysql = require('mysql');

exports.connection = mysql.createConnection({ 
  host: 'localhost', 
  user: 'test',
  password: 'test',
  database: 'test_site'
});


exports.letterNumber = /^[0-9a-zA-ZöäåÖÄÅ]+$/;
exports.letterNumberSpace = /^[0-9a-zA-ZöäåÖÄÅ ]+$/;


exports.setIO = function(socket){
  exports.io = socket;
};