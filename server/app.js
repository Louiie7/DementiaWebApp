//this file contains everything related to recieving requests. Beware uppercase is not a convention in node js.

const http = require("http"); // the http module is used to create the server
const port = 3000; // the port the server is Listining at
const fileHandler = require("fs"); // used to read from files.
const pathHandler = require("path"); // used to work with paths
const mysql = require('mysql'); // used to connect to the mysql server
const database = require('./database'); // the database module handles all communication with the database. OBS: we created this.

//initialises and configures a connection object to the mysql database
const connection = mysql.createConnection({
  password: "theROOTpass312",
  host: "localhost",
  user: "root",
  port:'3306', // the mysql database runs on this port
  database:"brain"
});

// now the connection object actually connects to the database
connection.connect(function(error) {
  if (error){
    throw error;
  }
});

// The server is being created and starts Listining on the port. There are smarter ways of handling different sorts of server requests exists but we try to avoid frameworks.
http.createServer(requestHandler).listen(port, () => console.log("Listining on port " + port))

// returns null: this function handles all incoming requests. For all request handlers the res object is the reponse object and the req object is the request object.
function requestHandler(req, res){
  console.log(req.url); // the following lines redirects the request to different request handlers.
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

// returns null: this functions handles invalid requests
function errorHandling(req, res){
  res.writeHead(505)
  res.write("Error 505 : Internal Server Error");
  res.end()
}

//returns null: this function handles recieve post requests.
function recieveRequestHandler(req, res){
  res.writeHead(200, {"Content-Type": "text/html"}); // sets the header of the response
  let body = [];
  req.on('data', function(part) { // this part picks up the bitstream of bodydata and appends to the body array.
    body.push(part);
  }).on('end', () => { //when the body has been colleceted this callback is called.
    body = JSON.parse(Buffer.concat(body).toString()); // the body is converted to String and then a javascript object.
    database.getFromDatabase(body, connection).then((value) => { // gets the best matching note and configures the callback for the promise returned
      res.write(value); // then the response object writes the best matching note
      console.log(value);
      res.end();
    });
  });
}

//returns null: this function handles record post requests.
function recordRequestHandler(req, res){
  res.writeHead(200, {"Content-Type": "text/html"});// sets the header of the response
  let body = [];
  req.on('data', function(part) {  // this part picks up the bitstream of bodydata and appends to the body array.
    body.push(part);
  }).on('end', () => { //when the body has been colleceted this callback is called.
    body = JSON.parse(Buffer.concat(body).toString());// the body is converted to String and then a javascript object.
    console.log(body.data)
    database.putInDatabase(body, connection); // the body containing the recording is inserted in the database.
    res.end();
  });
}

//returns null: this function handles get requests for all different ressources. There might be some security issues related to this function.
function GETRequestHandler(req, res){
  let reqPath = req.url;
  let fileExtension = pathHandler.extname(reqPath); // get the file extension of the request
  let types = {
    ".js":"application/javascript",
    ".html":"text/html",
    ".css":"text/css",
    ".json":"application/json",
    ".jpg":"image/jpeg",
    ".png":"image/png"
  }; // a table witht the different file extensions
  fileHandler.readFile("public" + reqPath, function(err, data){ /* the fileHandler reads the relative path
     from the request and calls the callback with the an error object and a data string
      (containing the content of the filel).*/
    if(err){ // if the ressource is not found
        res.writeHead(404);
        res.write("Error 404 : Ressource does not exist or you do not have permission");
        res.end();
    }else{ // if the file is found it is send back
      res.writeHead(200, {"Content-Type": types[fileExtension]})
      res.write(data);
      res.end();
    }
  })
}
