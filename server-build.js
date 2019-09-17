const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const pdfMakePrinter = require('pdfmake/src/printer');
const app = express();
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
      Raleway:
      {
        normal: 'build/fonts/Raleway-Regular.ttf',
        medium: 'build/fonts/Raleway-Medium.ttf',
        bold: 'build/fonts/Raleway-Bold.ttf',
        italics: 'build/fonts/Raleway-Italic.ttf',
        bolditalics: 'build/fonts/Raleway-MediumItalic.ttf',
        light: 'build/fonts/Raleway-Light.ttf',
        lightitalics: 'build/fonts/Raleway-LightItalic.ttf'
      },
      Gothic:
      {
        normal: 'build/fonts/GOTHIC.ttf',
        bold: 'build/fonts/GOTHICB.ttf',
        italics: 'build/fonts/GOTHICI.ttf',
        bolditalics: 'build/fonts/GOTHICBI.ttf'
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
  let PDFlang = {};
  let seller = [];
  let isRussian = 0;
  //switch statements for pdf generation
  switch (JSON.stringify(JSONanswer.lang).replace(/"/g,"")) {
  case "Русский":
    PDFlang = PDFlanguages.rus;
    isRussian = 1;
    break;
  case "Английский":
    PDFlang = PDFlanguages.eng;
    break;
  case "Португальский":
    PDFlang = PDFlanguages.por;
    break;
  default:
    break;
  };
  switch (JSON.stringify(JSONanswer.seller).replace(/"/g,"")) {
  case "Кайо":
    seller = PDFlanguages.seller.Кайо;
    break;
  case "Александр":
    seller = PDFlanguages.seller.Александр;
    break;
  case "Владмир":
    seller = PDFlanguages.seller.Владмир;
    break;
  case "Кирилл":
    seller = PDFlanguages.seller.Кирилл;
    break;
  default:
    break;
  };

  //pdf generation, minimize this unless working on it//
  let DOCdefinition = {
    content: [
      { image: 'build/logo-big.png', style: 'imgcorner', width: 243, height: 62,  },
      { text: JSON.stringify(PDFlang.h1).replace(/"/g,""), style: 'header', margin: [0, 0, 0, 60] },
      { text: JSON.stringify(PDFlang.h2).replace(/"/g,""), style: 'subheader' },
      { text: JSON.stringify(JSONanswer.client).replace(/"/g,""), style: 'header', fontSize: 20, margin: [0, 0, 0, 20] },
      { text: JSON.stringify(PDFlang.h3).replace(/"/g,""), style: 'subheader' },
      { text: JSON.stringify(seller[isRussian]).replace(/"/g,"") + ' - Kickidler',  style: 'header', fontSize: 20, margin: [0, 0, 0, 110] },
      { image: 'build/pdfback.jpg', alignment: 'center' },
  		{
        pageBreak: 'before',
        margin: [0, 0, 0, 50],
  			table: {
  				body: [
  					[
  						{
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
  							fillColor: '#1a2c69',
  							text: JSON.stringify(PDFlang.p1).replace(/"/g,""), style: 'headertable1'
  						}
            ],
            [
  						{
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
  							text: JSON.stringify(PDFlang.p2).replace(/"/g,""), style: 'paratable1'
  						}
            ],
            [
  						{
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
  							fillColor: '#1a2c69',
  							text: JSON.stringify(PDFlang.p3).replace(/"/g,""), style: 'headertable1'
  						}
            ],
            [
              {
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                stack: [
                  '+' + JSON.stringify(PDFlang.p4).replace(/"/g,""),
                  '+' + JSON.stringify(PDFlang.p5).replace(/"/g,""),
                  '+' + JSON.stringify(PDFlang.p6).replace(/"/g,""),
                  '+' + JSON.stringify(PDFlang.p7).replace(/"/g,""),
                  '+' + JSON.stringify(PDFlang.p8).replace(/"/g,""),
                  '+' + JSON.stringify(PDFlang.p9).replace(/"/g,""),
                  '+' + JSON.stringify(PDFlang.p10).replace(/"/g,"")
                ],
                 style: 'paratable1',
              }
            ],
            [
  						{
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
  							fillColor: '#1a2c69',
  							text: JSON.stringify(PDFlang.p11).replace(/"/g,""), style: 'headertable1'
  						}
            ],
            [
              {
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                stack: [
                  JSON.stringify(PDFlang.p12).replace(/"/g,""),
                  JSON.stringify(PDFlang.p13).replace(/"/g,""),
                  JSON.stringify(PDFlang.p14).replace(/"/g,""),
                  JSON.stringify(PDFlang.p15).replace(/"/g,""),
                ],
                 style: 'paratable1'
              }
            ]
          ]
  			}
      },
      {
        table: {
          body: [
            [
              {
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                fillColor: '#004163',
                text: JSON.stringify(PDFlang.p16).replace(/"/g,""), style: 'headertable1'
              }
            ],
            [
              {
                borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                fillColor: '#c4d8f5',
                stack: [
                  JSON.stringify(PDFlang.p17).replace(/"/g,""),
                  ' ' + JSON.stringify(PDFlang.p18).replace(/"/g,""),
                  ' ' + JSON.stringify(PDFlang.p19).replace(/"/g,""),
                  ' ' + JSON.stringify(PDFlang.p20).replace(/"/g,""),
                  ' ' + JSON.stringify(PDFlang.p21).replace(/"/g,""),
                ],
                 style: 'paratable1',
              }
            ]
          ]
        }
  		},
  	],
  	styles: {
      imgcorner: {
        alignment: 'right',
        margin: [0, 10, 0, 80]
      },
  		header: {
        font: 'Gothic',
        alignment: 'center',
  			fontSize: 28,
  			bold: true,
        color: 'grey',
  		},
  		subheader: {
        font: 'Gothic',
        alignment: 'center',
  			fontSize: 16,
  			bold: true,
        color: 'silver',
  		},
      headertable1: {
        font: 'Gothic',
        alignment: 'center',
        fontSize: 10,
        bold: true,
        color: 'white'
      },
      paratable1: {
        font: 'Gothic',
        fontSize: 11,
        bold: false,
        color: 'black'
      },
  	}
  };
  /////////

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
