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
const uri = "mongodb+srv://user:password@cluster0-kickidlerapp-5ozqk.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err) return console.log(err);
  assert.equal(null, err);
  app.listen(8008, () =>
  {
    console.log("> Connected successfully to the mongodb server\n> Express server is running on 'IPv4':8008\n> To have the app working at your IP:\n> 1.Edit the IPv4 form.jsx and graphic.jsx at src/components/\n> 2.Rebuild with 'npm run build'");
  });
});

//server//
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/send', (req, res) => {
  const thisBuilder = new DocBuilder(JSONanswer);
  let pdfTablePrices = thisBuilder.calculatePrices();
  generatePdf(thisBuilder.buildDoc(pdfTablePrices), (response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response); // Buffer data
  });
});

app.get('/graphic-backend', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  client.db("Cluster0-kickidlerapp").collection("test").find().toArray().then((docs) => {
      let sellerID = 0;
      let counterAmount = [0, 0, 0, 0];
      let counterDiscount = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
      docs.forEach( (item, index) =>
      {
        if(JSON.stringify(item.seller).replace(/"/g,"") == "Кайо")
        {
          sellerID = 0;
        }
        else if(JSON.stringify(item.seller).replace(/"/g,"") == "Александр")
        {
          sellerID = 1;
        }
        else if(JSON.stringify(item.seller).replace(/"/g,"") == "Владмир")
        {
          sellerID = 2;
        }
        else if(JSON.stringify(item.seller).replace(/"/g,"") == "Кирилл")
        {
          sellerID = 3;
        }
        else if(JSON.stringify(item.seller).replace(/"/g,"") == "Алехандро")
        {
          sellerID = 4;
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
  JSONanswer = req.body;
  client.db("Cluster0-kickidlerapp").collection("test").insertOne(JSONanswer, (err, result) => {
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
