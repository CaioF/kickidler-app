//express+parser requirements
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
//mongo requirement
const MongoClient = require('mongodb').MongoClient;
//pdfmake requirements
const pdfMakePrinter = require('pdfmake/src/printer');
const DocBuilder = require('./doc_builder.js');
global.PDFlanguages = require('./templates_lang.js');
global.JSONanswer = {};

//mongodb//
const uri = "mongodb+srv://fleury:<password>@cluster0-kickidlerapp-5ozqk.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  if (err) return console.log(err);

  db = client.db("Cluster0-kickidlerapp");
  db.collection('test').find({}).toArray().then((docs) => {
      const counters = [0, 0, 0, 0];
      docs.forEach( (item, index) =>
      {
        switch (JSON.stringify(item.seller).replace(/"/g,"")) {
        case "Кайо":
          counters[0]++;
          break;
        case "Александр":
          counters[1]++;
          break;
        case "Владмир":
          counters[2]++;
          break;
        case "Кирилл":
          counters[3]++;
          break;
        default:
          console.log(JSON.stringify(item.seller).replace(/"/g,""));
          break;
        };
      });
    }).catch((err) => {
      console.log(err);
    }).finally(() => {
      app.listen(8008, () =>
      {
        console.log("> Server is running on port 8008\n> The SPA is set to send POST requests to the IP http://192.168.1.62\n> To change the IP edit the handleClick() function at src/components/form.jsx and rebuild");
      });
    });
});

//server//
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
  // let caio = db.test.find( { seller: "Кайо" } ).count();
});

app.get('/send', function(req, res) {
  const thisBuilder = new DocBuilder(JSONanswer);
  let pdfTablePrices = thisBuilder.calculatePrices();
  generatePdf(thisBuilder.buildDoc(pdfTablePrices), (response) => {
    res.setHeader('Content-Type', 'application/pdf');
    res.send(response); // Buffer data
  });
});

app.post('/send', function (req, res) {
  JSONanswer = req.body;
  db.collection('test').insertOne(req.body, (err, result) => {
    if (err) return console.log(err);

    console.log("saved to database");
    res.redirect('../send');
  })
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
