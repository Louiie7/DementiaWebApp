var mysql = require('mysql');

let connection = mysql.createConnection({
  password: "RootPassLouie",
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

    connection = mysql.createConnection({
      password: "RootPassLouie",
      host: "localhost",
      user: "root",
      port:'3306',
      database:"brain"
    });

    connection.query("CREATE TABLE notes (id int auto_increment, original MEDIUMTEXT, keywords MEDIUMTEXT, PRIMARY KEY (id))", function (error, data) {if (error){throw error;}});
    connection.query("CREATE TABLE keywords (id int auto_increment, keyword MEDIUMTEXT, amount INT, associatedNotes MEDIUMTEXT, PRIMARY KEY (id))", function (error, data) {if (error){throw error;}});

  });
});
