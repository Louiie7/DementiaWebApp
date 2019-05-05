//this file contains everything

const http = require("http"); // the http
const port = 3000;
const fileHandler = require("fs");
const pathHandler = require("path");
const mysql = require('mysql');
const database = require('./database');
const qs = require('querystring'); //Uppercase is not a convention in node js.

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
http.createServer(requestHandler).listen(port, () => console.log("Listining on port " + port))

function requestHandler(req, res){
  console.log(req.url);
  if(req.method == "GET"){
    GETRequestHandler(req, res);
  }else if(req.method == "POST" && req.url == "/Record"){
    recordRequestHandler(req, res);
  }else if(req.method == "POST" && req.url == "/Receive"){
    recieveRequestHandler(req, res);
  }else{
    errorHandling(req, res);
  }
}

function errorHandling(req, res){
  res.writeHead(505)
  res.write("Error 505 : Internal Server Error");
  res.end()
}

function recieveRequestHandler(req, res){
  res.writeHead(200, {"Content-Type": "text/html"})
  let body = [];
  req.on('data', function(part) {
    body.push(part);
  }).on('end', () => {
    body = JSON.parse(Buffer.concat(body).toString());
    database.getFromDatabase(body, connection).then((value) => {
      res.write(value);
      console.log(value);
      res.end();
    });
  });
}

function recordRequestHandler(req, res){
  res.writeHead(200, {"Content-Type": "text/html"})
  let body = [];
  req.on('data', function(part) {
    body.push(part);
  }).on('end', () => {
    body = JSON.parse(Buffer.concat(body).toString());
    console.log(body.data)
    database.putInDatabase(body, connection);
    res.end();
  });
}

function GETRequestHandler(req, res){
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
}
