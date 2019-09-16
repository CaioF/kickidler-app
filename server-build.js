const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdfMakePrinter = require('pdfmake/src/printer');
const app = express();

var docDefinition = {
  content: ['тест']
};

function generatePdf(docDefinition, callback) {
  try {
    const fontDescriptors = { ... };
    const printer = new pdfMakePrinter(fontDescriptors);
    const doc = printer.createPdfKitDocument(docDefinition);

    let chunks = [];

    doc.on('data', (chunk) => {
      chunks.push(chunk);
    });

    doc.on('end', () => {
       callback(Buffer.concat(chunks));
     });

    doc.end();

  } catch(err) {
    throw(err);
  }
};

app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/send', function(req, res) {
  generatePdf(docDefinition, (response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response); // Buffer data
  });
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
