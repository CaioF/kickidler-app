const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdfMakePrinter = require('pdfmake/src/printer');
const app = express();
//json from form//
global.JSONanswer = {};
//pdfmake//
global.PDFlanguages = {
  rus: {
    one: "это",
    two: "тест"
  },
  eng: {
    one: "this is",
    two: "a test"
  },
  por: {
    one: "isso é",
    two: "um teste"
  },
};
global.PDFlang = {};
global.DOCdefinition = {};

function generatePdf(docDefinition, callback) {
  console.log(JSONanswer);
  try {
    const fontDescriptors = {
      Roboto: {
    		normal: 'build/fonts/Roboto-Regular.ttf',
    		bold: 'build/fonts/Roboto-Medium.ttf',
    		italics: 'build/fonts/Roboto-Italic.ttf',
    		bolditalics: 'build/fonts/Roboto-MediumItalic.ttf'
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

  switch (JSON.stringify(JSONanswer.lang)) {
  case '"Русский"':
    PDFlang = PDFlanguages.rus;
    break;
  case '"Английский"':
    PDFlang = PDFlanguages.eng;
    break;
  case '"Португальский"':
    PDFlang = PDFlanguages.por;
    break;
  default:
    break;
  };

  DOCdefinition = {
    content: [
      { text: 'Tables', style: 'header' },
      { text: JSON.stringify(PDFlang.one) },
      { text: JSON.stringify(PDFlang.two), style: 'subheader' },
      ':)',
      {
        style: 'tableExample',
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3'],
            [{ text: JSON.stringify(JSONanswer.client) }, { text: JSON.stringify(JSONanswer.amount) }, 'OK?']
          ]
        }
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10]
      },
      subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
      },
      tableExample: {
        margin: [0, 5, 0, 15]
      },
    },
    defaultStyle: {
      //alignment: 'justify'
    }
  };
  generatePdf(DOCdefinition, (response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response); // Buffer data
  });
});

app.post('/send', function (req, res) {
  JSONanswer = req.body;
  res.redirect('../send');
});

app.listen(8008);
console.log("Server is running on port 8008, set to local IP 192.168.19.217, to change the IP edit form.jsx file and rebuild");
