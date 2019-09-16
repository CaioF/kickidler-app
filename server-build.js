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
    h1: "PROPOSTA DE ORÇAMENTO",
    h2: "PREPARADA PARA",
    h3: "PREPARADA POR",
    h4: "- Kickidler",
    ph1: "O que é a Kickidler?",
    p1: "Nosso programa de monitoramento permite ver o quê os seus funcionários estão fazendo, quais sites estão abrindo, quais programas estão usando. A Kickidler automaticamente gera relátorios inteligentes e sinaliza sobre qualquer infração das regras de trabalho. Facilitando a contabilização do tempo de trabalho e garantindo a eficácia e a segurança da sua empresa.",
    ph2: "Principais Características",
    l1: "Relatórios inteligentes",
    l2: "Controle de infrações",
    l3: "Monitoramento online",
    l4: "Gravação em video do histórico de uso",
    l5: "Calendário de trabalho customizável",
    l6: "Acesso remoto ao PC dos seus funcionários",
    l7: "E muito mais!",
    ph3: "Componentes do Programa",
    l8: "1.	Grabber – Software de coleta de dados, instalado no computador do(s) funcionário(s) a serem monitorados. Pode ser instalado tanto em modo secreto (invísivel) quanto não (visível). Necessita de licença para ser usado.",
    l9: "2.	Viewer – Software de monitoramento de dados e controle de funcionários, instalado no computador do(s) funcionário(s) que estarão monitorando.",
    l10: "3.	Servidor Central – Servidor responsável pelo armazenamento dos dados, pela comunicação entre o Viewer e o Grabber e a configuração dos mesmos. É instalado no servidor da empresa ou em um computador que satisfaça os Requisitos Técnicos.",
    l11: "4.	Suporte técnico ilimitado – Nosso suporte cobre desde treinamento do uso da ferramenta a instalação e manutenção. Nós da Kickidler estamos sempre ao seu dispor.",
    ph4: "Requisitos Técnicos",
    p2: "Para o monitoramento de 100 funcionários com uma velocidade de gravação de 60 capturas de tela por minuto. Recomendamos:", //Work on the calculator
    l12: "    1. HDD RAID 0 – 1.5 TB",
    l13: "    2. RAM - 16 GB",
    l14: "    3. CPU QUAD CORE 3 GHz",
    l15: "    4. Velocidade da rede local superior a 100 Mbit/s",
    ph5: "Para mais informações por favor acesse",
    a1: "https://www.kickidler.com/br/for-it/installation-instructions/system-requirements.html",
    th1: "Overview do Orçamento",
    th2: "Nome do Produto",
    tp1: "Software de monitoramento de funcionários - Kickidler",
    th3: "Tipo do produto e quantidade",
    tp2: "Licensiamento do uso do software Grabber,", //x licenças
    th4: "Empresa contratadora",
    tp3: "IT Service Management LLC. Russia, Moscou, R. Derbenevskaya Naberezhnaya, 11",
  },
  eng: {
    h1: "PROPOSTA DE ORÇAMENTO",
    h2: "PREPARADA PARA",
    h3: "PREPARADA POR",
    h4: "- Kickidler",
    ph1: "O que é a Kickidler?",
    p1: "Nosso programa de monitoramento permite ver o quê os seus funcionários estão fazendo, quais sites estão abrindo, quais programas estão usando. A Kickidler automaticamente gera relátorios inteligentes e sinaliza sobre qualquer infração das regras de trabalho. Facilitando a contabilização do tempo de trabalho e garantindo a eficácia e a segurança da sua empresa.",
    ph2: "Principais Características",
    l1: "Relatórios inteligentes",
    l2: "Controle de infrações",
    l3: "Monitoramento online",
    l4: "Gravação em video do histórico de uso",
    l5: "Calendário de trabalho customizável",
    l6: "Acesso remoto ao PC dos seus funcionários",
    l7: "E muito mais!",
    ph3: "Componentes do Programa",
    l8: "1.	Grabber – Software de coleta de dados, instalado no computador do(s) funcionário(s) a serem monitorados. Pode ser instalado tanto em modo secreto (invísivel) quanto não (visível). Necessita de licença para ser usado.",
    l9: "2.	Viewer – Software de monitoramento de dados e controle de funcionários, instalado no computador do(s) funcionário(s) que estarão monitorando.",
    l10: "3.	Servidor Central – Servidor responsável pelo armazenamento dos dados, pela comunicação entre o Viewer e o Grabber e a configuração dos mesmos. É instalado no servidor da empresa ou em um computador que satisfaça os Requisitos Técnicos.",
    l11: "4.	Suporte técnico ilimitado – Nosso suporte cobre desde treinamento do uso da ferramenta a instalação e manutenção. Nós da Kickidler estamos sempre ao seu dispor.",
    ph4: "Requisitos Técnicos",
    p2: "Para o monitoramento de 100 funcionários com uma velocidade de gravação de 60 capturas de tela por minuto. Recomendamos:", //Work on the calculator
    l12: "    1. HDD RAID 0 – 1.5 TB",
    l13: "    2. RAM - 16 GB",
    l14: "    3. CPU QUAD CORE 3 GHz",
    l15: "    4. Velocidade da rede local superior a 100 Mbit/s",
    ph5: "Para mais informações por favor acesse",
    a1: "https://www.kickidler.com/br/for-it/installation-instructions/system-requirements.html",
    th1: "Overview do Orçamento",
    th2: "Nome do Produto",
    tp1: "Software de monitoramento de funcionários - Kickidler",
    th3: "Tipo do produto e quantidade",
    tp2: "Licensiamento do uso do software Grabber,", //x licenças
    th4: "Empresa contratadora",
    tp3: "IT Service Management LLC. Russia, Moscou, R. Derbenevskaya Naberezhnaya, 11",
  },
  por: {
    h1: "PROPOSTA DE ORÇAMENTO",
    h2: "PREPARADA PARA",
    h3: "PREPARADA POR",
    h4: "- Kickidler",
    ph1: "O que é a Kickidler?",
    p1: "Nosso programa de monitoramento permite ver o quê os seus funcionários estão fazendo, quais sites estão abrindo, quais programas estão usando. A Kickidler automaticamente gera relátorios inteligentes e sinaliza sobre qualquer infração das regras de trabalho. Facilitando a contabilização do tempo de trabalho e garantindo a eficácia e a segurança da sua empresa.",
    ph2: "Principais Características",
    l1: "Relatórios inteligentes",
    l2: "Controle de infrações",
    l3: "Monitoramento online",
    l4: "Gravação em video do histórico de uso",
    l5: "Calendário de trabalho customizável",
    l6: "Acesso remoto ao PC dos seus funcionários",
    l7: "E muito mais!",
    ph3: "Componentes do Programa",
    l8: "1.	Grabber – Software de coleta de dados, instalado no computador do(s) funcionário(s) a serem monitorados. Pode ser instalado tanto em modo secreto (invísivel) quanto não (visível). Necessita de licença para ser usado.",
    l9: "2.	Viewer – Software de monitoramento de dados e controle de funcionários, instalado no computador do(s) funcionário(s) que estarão monitorando.",
    l10: "3.	Servidor Central – Servidor responsável pelo armazenamento dos dados, pela comunicação entre o Viewer e o Grabber e a configuração dos mesmos. É instalado no servidor da empresa ou em um computador que satisfaça os Requisitos Técnicos.",
    l11: "4.	Suporte técnico ilimitado – Nosso suporte cobre desde treinamento do uso da ferramenta a instalação e manutenção. Nós da Kickidler estamos sempre ao seu dispor.",
    ph4: "Requisitos Técnicos",
    p2: "Para o monitoramento de 100 funcionários com uma velocidade de gravação de 60 capturas de tela por minuto. Recomendamos:", //Work on the calculator
    l12: "    1. HDD RAID 0 – 1.5 TB",
    l13: "    2. RAM - 16 GB",
    l14: "    3. CPU QUAD CORE 3 GHz",
    l15: "    4. Velocidade da rede local superior a 100 Mbit/s",
    ph5: "Para mais informações por favor acesse",
    a1: "https://www.kickidler.com/br/for-it/installation-instructions/system-requirements.html",
    th1: "Overview do Orçamento",
    th2: "Nome do Produto",
    tp1: "Software de monitoramento de funcionários - Kickidler",
    th3: "Tipo do produto e quantidade",
    tp2: "Licensiamento do uso do software Grabber,", //x licenças
    th4: "Empresa contratadora",
    tp3: "IT Service Management LLC. Russia, Moscou, R. Derbenevskaya Naberezhnaya, 11",
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

  switch (JSON.stringify(JSONanswer.lang).replace(/"/g,"")) {
  case "Русский":
    PDFlang = PDFlanguages.rus;
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

  DOCdefinition = {
    content: [
      { text: JSON.stringify(PDFlang.h1).replace(/"/g,""), style: 'header' },
      { text: JSON.stringify(PDFlang.h2).replace(/"/g,"") },
      { text: JSON.stringify(PDFlang.h3).replace(/"/g,""), style: 'subheader' },
      { text: JSON.stringify(PDFlang.h4).replace(/"/g,"") },
      {
        style: 'tableExample',
        table: {
          body: [
            ['Column 1', 'Column 2', 'Column 3'],
            [{ text: JSON.stringify(JSONanswer.client).replace(/"/g,"") }, { text: JSON.stringify(JSONanswer.amount).replace(/"/g,"") }, 'OK?']
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
