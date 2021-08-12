const express = require("express");
const app = express();
const path = require("path");

app.get("/sprites/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "/sprites/"+req.params.file))
})
app.get("/scenes/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "/scenes/"+req.params.file))
})
app.get("/kaboom-js/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "/kaboom-js/"+req.params.file))
})
app.get("/sounds/:file", (req, res) => {
  res.sendFile(path.join(__dirname, "/sounds/"+req.params.file))
})

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"))
})

app.listen(8080);