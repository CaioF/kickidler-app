const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/send', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.post('/send', function (req, res) {
  console.log(req.body);
  res.redirect('../send');
});

app.listen(3000);
console.log("Server is running on port 3000");
