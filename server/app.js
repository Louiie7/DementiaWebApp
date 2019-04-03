const http = require("http")
const port = 3000
const fileHandler = require("fs")
const pathHandler = require("path")

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
    res.write("test1")
    res.end();
  }else if(req.method == "POST" && req.url == "/Receive"){
    res.writeHead(200, {"Content-Type": "text/html"})
    res.write("Hello from the server!")
    res.end();
  }else{
    res.writeHead(505)
    res.write("Error 505 : Internal Server Error");
    res.end()
  }
}).listen(port, () => console.log("Listining on port " + port))
