var mysql = require('mysql');

let connection = mysql.createConnection({
  password: "theROOTpass312",
  host: "localhost",
  user: "root",
  port:'3306',
});

console.log(connection)

connection.connect(function(error) {
  if (error){
    throw error;
  }
  connection.query("CREATE DATABASE brain", function (error, data) {
    if (error){
      throw error;
    }
  });
});
