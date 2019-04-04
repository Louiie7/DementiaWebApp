const http = require("http")
const port = 3000
const fileHandler = require("fs")
const pathHandler = require("path")
const mysql = require('mysql');
const database = require('./database');
const qs = require('querystring');

const connection = mysql.createConnection({
  password: "theROOTpass312",
  host: "localhost",
  user: "root",
  port:'3306',
  database:"brain"
});

connection.connect(function(error) {
  if (error){
    throw error;
  }
})

// Smarter ways of handling different sorts of server requests exists but we try to avoid frameworks.

http.createServer(function(req, res){
  console.log(req.url)
  if(req.method == "GET"){
    let reqPath = req.url;
    let fileExtension = pathHandler.extname(reqPath);
    let types = {
      ".js":"application/javascript",
      ".html":"text/html",
      ".css":"text/css",
      ".json":"application/json",
      ".jpg":"image/jpeg",
      ".png":"image/png"
    }
    fileHandler.readFile("public" + reqPath, function(err, data){
      if(err){
          res.writeHead(404)
          res.write("Error 404 : Ressource does not exist or you do not have permission");
          res.end()
      }else{
        res.writeHead(200, {"Content-Type": types[fileExtension]})
        res.write(data);
        res.end();
      }
    })
  }else if(req.method == "POST" && req.url == "/Record"){
    res.writeHead(200, {"Content-Type": "text/html"})
    let body = [];
    req.on('data', function(part) {
      body.push(part);
    }).on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString());
      database.putInDatabase(body, connection);
    });
    res.end();
  }else if(req.method == "POST" && req.url == "/Receive"){
    res.writeHead(200, {"Content-Type": "text/html"})
    let body = [];
    req.on('data', function(part) {
      body.push(part);
    }).on('end', () => {
      body = JSON.parse(Buffer.concat(body).toString());
      res.write(database.getFromDatabase(body, connection));
    });
    res.end();
  }else{
    res.writeHead(505)
    res.write("Error 505 : Internal Server Error");
    res.end()
  }
}).listen(port, () => console.log("Listining on port " + port))
