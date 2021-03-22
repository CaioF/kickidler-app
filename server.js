//express+parser requirements
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
//mongo Requirements
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;
//pdfmake requirements
const pdfMakePrinter = require('pdfmake/src/printer');
const DocBuilder = require('./doc_builder.js');
global.PDFlanguages = require('./templates_lang.js');
global.JSONanswer = {};

//mongodb//
require('dotenv').config();
const client = new MongoClient(process.env.DBURI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err) return console.log(err);
  assert.equal(null, err);
  app.listen(process.env.PORT || 8008, () =>
  {
    console.log("> Connected successfully to the mongodb server\n> Server is running on 'IPv4':process.env.PORT || 8008\n> To have the app working at your IP:\n> 1.Edit the IPv4 form.jsx and graphic.jsx at src/components/\n> 2.Rebuild with 'npm run build'");
  });
});

//server//
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/send', (req, res) => {
  const thisBuilder = new DocBuilder(global.global.JSONanswer);
  let pdfTablePrices = thisBuilder.calculatePrices()
  generatePdf(thisBuilder.buildDoc(pdfTablePrices), (response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response); // Buffer data
  });
});

app.get('/graphic-backend', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  client.db("dev").collection("test").find().toArray().then((docs) => {
      let sellerID = 0;
      let counterAmount = [0, 0, 0, 0];
      let counterDiscount = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      docs.forEach( (item, index) =>
      {
        if(JSON.stringify(item.seller).replace(/"/g,"") === "User 1")
        {
          sellerID = 0;
        }
        else if(JSON.stringify(item.seller).replace(/"/g,"") === "User 2")
        {
          sellerID = 1;
        }
        else if(JSON.stringify(item.seller).replace(/"/g,"") === "User 3")
        {
          sellerID = 2;
        }
        counterAmount[sellerID]++;
        counterDiscount[0][sellerID] += Number(item.discount_year);
        counterDiscount[1][sellerID] += Number(item.discount_3years);
        counterDiscount[2][sellerID] += Number(item.discount_lifetime);
      });
      res.send({express: counterAmount});
    }).catch((err) => {
      console.log(err);
    });
});

app.post('/pdf-backend', (req, res) => {
  global.global.JSONanswer = req.body;
  client.db("Cluster0-kickidlerapp").collection("test").insertOne(global.global.JSONanswer, (err, result) => {
    assert.equal(null, err);
    console.log("> New input saved to database");
    res.redirect('../send');
  });
});

function generatePdf(docDefinition, callback) {
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
