// Use Node's  "http" module to make a web server
const http = require("http");


// Use Node's  "fs" module to work with files
const fs = require("fs");


// Make the server
const server = http.createServer((req, res) => {

  
  // If someone goes to "/", show a welcome message
  if (req.url === "/") {
    res.end("Welcome to my Node.js server!");


  // If someone goes to "/time", send the current time in JSON
  } else if (req.url === "/time") {
    res.setHeader("Content-Type", "application/json"); 
    res.end(JSON.stringify({ time: new Date().toISOString() }));


  // If someone goes to "/files", send back the list of files in this folder
  } else if (req.url === "/files") {
    fs.readdir(".", (err, files) => {
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify({ files }));
    });

    
  // If someone goes to "/health", send back a simple "ok" status
  } else if (req.url === "/health") {
    res.setHeader("Content-Type", "application/json"); 
    res.end(JSON.stringify({ status: "ok" }));


  // If the page is not found, send 404 error message 
  } else {
    res.statusCode = 404; 
    res.end("404 Not Found");
  }
});

// Start the server on port 3000
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000/");
});
