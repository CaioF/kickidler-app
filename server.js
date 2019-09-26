const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdfMakePrinter = require('pdfmake/src/printer');
const app = express();
const DocBuilder = require('./doc_builder.js');
global.PDFlanguages = require('./public/templates_lang.js');
global.JSONanswer = {};

function generatePdf(docDefinition, callback) {
  console.log(JSONanswer);
  try {
    const fontDescriptors = {
      Roboto: {
    		normal: 'build/fonts/Roboto-Regular.ttf',
    		bold: 'build/fonts/Roboto-Medium.ttf',
    		italics: 'build/fonts/Roboto-Italic.ttf',
    		bolditalics: 'build/fonts/Roboto-MediumItalic.ttf'
	    },
      Gothic:
      {
        normal: 'build/fonts/GOTHIC.ttf',
        bold: 'build/fonts/GOTHICB.ttf',
        italics: 'build/fonts/GOTHICI.ttf',
        bolditalics: 'build/fonts/GOTHICBI.ttf'
      },
      Wingdings:
      {
        normal: 'build/fonts/Wingdings-Regular.ttf'
      }
    };

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
///////////////////////////////////////////////////////////

//server//
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/send', function(req, res) {
  const thisBuilder = new DocBuilder(JSONanswer);

  const pricesJSON = thisBuilder.getPricesData([1,3,6,12]); // array argument with month count items, 0 = lifetime, empty or [] return full month list
  setTimeout(function () {
    console.log("!" + JSON.stringify(pricesJSON)); //?
  }, 1000);
  generatePdf(thisBuilder.buildDoc(pricesJSON), (response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response); // Buffer data
  });
});

app.post('/send', function (req, res) {
  JSONanswer = req.body;
  res.redirect('../send');
});

app.listen(8008);
console.log("Server is running on port 8008\nThe SPA is set to send POST requests to the IP 192.168.19.217\nTo change the IP edit the handleClick() function at src/components/form.jsx and rebuild");
