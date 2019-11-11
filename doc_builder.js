class DocBuilder {
  constructor(JSONanswer) {
    this.JSONanswer = JSONanswer;
    this.JSONcurrencies = PDFlanguages.currency;
    this.withConversion = 1;
    //switch statements for pdf generation
    //language definition switch
    switch (JSON.stringify(this.JSONanswer.lang).replace(/"/g,"")) {
    case "Русский":
      this.PDFlang = PDFlanguages.rus;
      this.isRussian = 1;
      break;
    case "Английский":
      this.PDFlang = PDFlanguages.eng;
      this.isRussian = 0;
      break;
    case "Португальский":
      this.PDFlang = PDFlanguages.por;
      this.isRussian = 0;
      break;
    default:
      break;
    };
    //seller definition switch
    switch (JSON.stringify(this.JSONanswer.seller).replace(/"/g,"")) {
    case "Кайо":
      this.seller = PDFlanguages.seller.Кайо;
      break;
    case "Александр":
      this.seller = PDFlanguages.seller.Александр;
      break;
    case "Владмир":
      this.seller = PDFlanguages.seller.Владмир;
      break;
    case "Кирилл":
      this.seller = PDFlanguages.seller.Кирилл;
      break;
      case "Алехандро":
        this.seller = PDFlanguages.seller.Алехандро;
        break;
    default:
      break;
    };
    //origin_currency definition switch
    switch (JSON.stringify(this.JSONanswer.origin_currency).replace(/"/g,"")) {
    case "RUB":
       this.price =
      {
        prices: PDFlanguages.currency.prices_rub,
        name: PDFlanguages.currency.name[0],
        symbol: PDFlanguages.currency.symbol[0]
      };
      break;
    case "USD":
      this.price =
      {
        prices: PDFlanguages.currency.prices_usd,
        name: PDFlanguages.currency.name[1],
        symbol: PDFlanguages.currency.symbol[1]
      };
      break;
    default:
      this.prices = [];
      break;
    };
    //building the currencies object
    if(JSON.stringify(this.JSONanswer.conversion_currency).replace(/"/g,"") == "Без конверции валют")
    {
      this.currencies =
      {
        origin: this.price,
        client: {}
      };
      // this.withConversion = 0;
    }
    else
    {
      let str = JSON.stringify(this.JSONanswer.conversion_currency).replace(/"/g,"").split("-");
      this.currencies =
      {
        origin: this.price,
        client:
        {
          conversion: this.JSONanswer.conversion_rate,
          name: str[0],
          symbol: str[1],
        }
      }
    };
    //discount definition switch
    this.discounts = [this.JSONanswer.discount_year, this.JSONanswer.discount_3years, this.JSONanswer.discount_lifetime];
    for (let i = 0; i < 3; i++)
    {
      if (JSON.stringify(this.discounts[i]).replace(/"/g,"") == "0")
      {
        this.discounts[i] = JSON.stringify(this.PDFlang.d2).replace(/"/g,"");
      }
      else
      {
        this.discounts[i] = `${this.discounts[i]}%`;
      }
    };
   }

  buildDoc(pdfTablePrices) {
    //calculator
    this.monthPricesData = {};

    this.paymentTypePercent = {
      payPal: 2.9,
      bank:   3.8,
    };

    for(let month in this.currencies.origin.prices){
      month = +month;

      let discountPercent = 0;

        switch(month){
          case 12:
            if(!!this.JSONanswer.discount_year){
              discountPercent = this.JSONanswer.discount_year;
            }
            break;
          case 36:
            if(!!this.JSONanswer.discount_3years){
              discountPercent = this.JSONanswer.discount_3years;
            }
            break;
          case 0:
            if(!!this.JSONanswer.discount_lifetime){
              discountPercent = this.JSONanswer.discount_lifetime;
            }
            break;
      this.monthPricesData[month].price = this.prices[month];
      this.monthPricesData[month].discountPercent = discountPercent;
      this.monthPricesData[month].calc_result = this.priceMonthCalculate(month);
      }
    }
  }
    
  buildDoc() {
    if(this.withConversion = 0)
    {
      var DOCdefinition = {
        content: [
          { image: 'build/logo-big.png', style: 'imgcorner', width: 223, height: 57  },
          { text: JSON.stringify(this.PDFlang.h1).replace(/"/g,""), style: 'header', margin: [0, 0, 0, 90] },
          { text: JSON.stringify(this.PDFlang.h2).replace(/"/g,""), style: 'subheader' },
          { text: JSON.stringify(this.JSONanswer.client).replace(/"/g,""), style: 'header', fontSize: 20, margin: [0, 0, 0, 20] },
          { text: JSON.stringify(this.PDFlang.h3).replace(/"/g,""), style: 'subheader' },
          { text: JSON.stringify(this.seller[this.isRussian]).replace(/"/g,"") + ' - Kickidler',  style: 'header', fontSize: 20, margin: [0, 0, 0, 110] },
          { image: 'build/pdfback.jpg', alignment: 'center' },
          {
            pageBreak: 'before',
            margin: [0, 0, 0, 30],
            table: {
              body: [
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#172259',
                    text: JSON.stringify(this.PDFlang.p1).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    text: JSON.stringify(this.PDFlang.p2).replace(/"/g,""), style: 'paratable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#172259',
                    text: JSON.stringify(this.PDFlang.p3).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    ul: [
                      ' ' + JSON.stringify(this.PDFlang.p4).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p5).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p6).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p7).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p8).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p9).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p10).replace(/"/g,"")
                    ],
                     style: 'paratable1',
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#172259',
                    text: JSON.stringify(this.PDFlang.p11).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    stack: [
                      JSON.stringify(this.PDFlang.p12).replace(/"/g,""),
                      JSON.stringify(this.PDFlang.p13).replace(/"/g,""),
                      JSON.stringify(this.PDFlang.p14).replace(/"/g,""),
                      JSON.stringify(this.PDFlang.p15).replace(/"/g,""),
                    ],
                     style: 'paratable1'
                  }
                ]
              ]
            }
          },
          {
            margin: [0, 0, 0, 30],
            table: {
              body: [
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#004163',
                    text: JSON.stringify(this.PDFlang.p16).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#d8e6f2',
                    stack: [
                      JSON.stringify(this.PDFlang.p17).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p18).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p19).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p20).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p21).replace(/"/g,""),
                    ],
                     style: 'paratable1',
                  }
                ]
              ]
            }
          },
          {
            table: {
              body: [
                [{colSpan: 2, text: JSON.stringify(this.PDFlang.t1).replace(/"/g,"") }, {}],
                [{text: JSON.stringify(this.PDFlang.t2).replace(/"/g,"") },{text: JSON.stringify(this.PDFlang.t3).replace(/"/g,"") },],
                [{text: JSON.stringify(this.PDFlang.t4).replace(/"/g,"") },{text: JSON.stringify(this.PDFlang.t5).replace(/"/g,"") + " " + JSON.stringify(this.JSONanswer.amount).replace(/"/g,"") + " " + JSON.stringify(this.PDFlang.t5_1[1]).replace(/"/g,"") }],
                [{text: JSON.stringify(this.PDFlang.t6).replace(/"/g,"") },{text: JSON.stringify(this.PDFlang.t7).replace(/"/g,"") },],
              ]
            },
          }
        ],
        styles: {
          imgcorner: {
            alignment: 'right',
            margin: [0, 10, 0, 100]
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
    }
    else
    {
      var DOCdefinition = {
        pageMargins: [20, 60, 20, "*"],
        content: [
          { image: 'build/logo-big.png', style: 'imgcorner', width: 170, height: 45  },
          { text: JSON.stringify(this.PDFlang.h1).replace(/"/g,""), style: 'header', margin: [0, 0, 0, 90] },
          { text: JSON.stringify(this.PDFlang.h2).replace(/"/g,""), style: 'subheader' },
          { text: JSON.stringify(this.JSONanswer.client).replace(/"/g,""), style: 'header', fontSize: 20, margin: [0, 0, 0, 20] },
          { text: JSON.stringify(this.PDFlang.h3).replace(/"/g,""), style: 'subheader' },
          { text: JSON.stringify(this.seller[this.isRussian]).replace(/"/g,"") + ' - Kickidler',  style: 'header', fontSize: 20, margin: [0, 0, 0, 110] },
          { image: 'build/pdfback.jpg', alignment: 'center' },
          {
            pageBreak: 'before',
            margin: [0, 0, 0, 30],
            table: {
              body: [
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#172259',
                    text: JSON.stringify(this.PDFlang.p1).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    text: JSON.stringify(this.PDFlang.p2).replace(/"/g,""), style: 'paratable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#172259',
                    text: JSON.stringify(this.PDFlang.p3).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    ul: [
                      ' ' + JSON.stringify(this.PDFlang.p4).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p5).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p6).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p7).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p8).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p9).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p10).replace(/"/g,"")
                    ],
                     style: 'paratable1',
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    fillColor: '#172259',
                    text: JSON.stringify(this.PDFlang.p11).replace(/"/g,""), style: 'headertable1'
                  }
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'],
                    stack: [
                      JSON.stringify(this.PDFlang.p12).replace(/"/g,""),
                      JSON.stringify(this.PDFlang.p13).replace(/"/g,""),
                      JSON.stringify(this.PDFlang.p14).replace(/"/g,""),
                      JSON.stringify(this.PDFlang.p15).replace(/"/g,""),
                    ],
                     style: 'paratable1'
                  }
                ]
              ]
            }
          },
          {
            margin: [0, 0, 0, 30],
            table: {
              body: [
                [
                  { colSpan: 2, borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'], fillColor: '#004163',
                    text: JSON.stringify(this.PDFlang.p16).replace(/"/g,""), style: 'headertable1'
                  },
                  {}
                ],
                [
                  {
                    colSpan: 2, borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'], fillColor: '#d8e6f2',
                    stack: [
                      JSON.stringify(this.PDFlang.p17).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p18).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p19).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p20).replace(/"/g,""),
                      ' ' + JSON.stringify(this.PDFlang.p21).replace(/"/g,""),
                    ],
                     style: 'paratable1',
                  },
                  {}
                ],
                [
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'], fillColor: '#d8e6f2',
                    text: JSON.stringify(this.PDFlang.p22).replace(/"/g,""), style: 'paratable1',
                  },
                  {
                    borderColor: ['#e3e3e3', '#e3e3e3', '#e3e3e3', '#e3e3e3'], fillColor: '#d8e6f2',
                    text: JSON.stringify(this.PDFlang.p23).replace(/"/g,""), style: 'paratable1',
                  }
                ]
              ]
            }
          },
          {
            table: {
              body: [
                [{colSpan: 2, text: JSON.stringify(this.PDFlang.t1).replace(/"/g,""), fillColor: '#444', style: 'headertable1' }, {}],
                [{text: JSON.stringify(this.PDFlang.t2).replace(/"/g,""), fillColor: '#555', style: 'darkCol' },{text: JSON.stringify(this.PDFlang.t3).replace(/"/g,"") },],
                [{text: JSON.stringify(this.PDFlang.t4).replace(/"/g,""), fillColor: '#555', style: 'darkCol' },{text: JSON.stringify(this.PDFlang.t5).replace(/"/g,"") + " " + JSON.stringify(this.JSONanswer.amount).replace(/"/g,"") + " " + JSON.stringify(this.PDFlang.t5_1[1]).replace(/"/g,"") }],
                [{text: JSON.stringify(this.PDFlang.t6).replace(/"/g,""), fillColor: '#555', style: 'darkCol' },{text: JSON.stringify(this.PDFlang.t7).replace(/"/g,"") },],
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            pageBreak: 'before',
            margin: [0, 0, 0, 15],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkHeader', text: JSON.stringify(this.PDFlang.t8).replace(/"/g,"")},
                  {style: 'darkHeader', text: JSON.stringify(this.PDFlang.t9).replace(/"/g,"")},
                  {style: 'darkHeader', text: JSON.stringify(this.PDFlang.t10).replace(/"/g,"") + " " + JSON.stringify(this.currencies.origin.name).replace(/"/g,"")},
                  {style: 'darkHeader', text: JSON.stringify(this.PDFlang.t11).replace(/"/g,"")},
                  {style: 'darkHeader', text: JSON.stringify(this.PDFlang.t12).replace(/"/g,"") + " " + JSON.stringify(this.currencies.client.name).replace(/"/g,"")},
                  {style: 'darkHeader', text: JSON.stringify(this.PDFlang.t13).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            margin: [0, 0, 0, 10],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t14).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t16).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[0] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.d2).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.pricePaypal[0] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser1[0] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ],
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t15).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t16).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[0] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.d2).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceBank[0] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser2[0] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            margin: [0, 0, 0, 10],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t14).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t17).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[1] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.d2).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.pricePaypal[1] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser1[1] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ],
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t15).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t17).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[1] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.d2).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceBank[1] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser2[1] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            margin: [0, 0, 0, 10],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t14).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t18).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[2] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.d2).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.pricePaypal[2] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser1[2] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ],
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t15).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t18).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[2] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.d2).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceBank[2] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser2[2] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            margin: [0, 0, 0, 10],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t14).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t19).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[3] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.discounts[0]).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.pricePaypal[3] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser1[3] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ],
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t15).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t19).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[3] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.discounts[0]).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceBank[3] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser2[3] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            margin: [0, 0, 0, 10],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t14).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t20).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[4] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.discounts[1]).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.pricePaypal[4] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser1[4] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ],
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t15).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t20).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[4] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.discounts[1]).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceBank[4] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser2[4] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
          {
            margin: [0, 0, 0, 10],
            table: {
              widths: [95, 75, 65, 75, 80, "*"],
              heights: 20,
              body: [
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t14).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t21).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[5] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.discounts[2]).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.pricePaypal[5] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser1[5] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ],
                [
                  {style: 'darkCol2', text: JSON.stringify(this.PDFlang.t15).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.PDFlang.t21).replace(/"/g,"")},
                  {style: 'simpleSymbolCol', text: pdfTablePrices.priceForX[5] + " " + JSON.stringify(this.currencies.origin.symbol).replace(/"/g,"")},
                  {style: 'simpleCol', text: JSON.stringify(this.discounts[2]).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceBank[5] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")},
                  {style: 'graySymbolCol', text: pdfTablePrices.priceMonthUser2[5] + " " + JSON.stringify(this.currencies.client.symbol).replace(/"/g,"")}
                ]
              ]
            },
            layout: {
              hLineColor: '#ddd',
              vLineColor: '#eee',
            }
          },
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t22).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t23).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t24).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t25).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t26).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t27).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t28).replace(/"/g,"")},
            {style: 'Footnote', text: JSON.stringify(this.PDFlang.t29).replace(/"/g,"")}
        ],
        styles: {
          imgcorner: {
            alignment: 'right',
            margin: [0, 10, 0, 100]
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
          darkCol: {
            font: 'Gothic',
            color: '#fff',
            alignment: 'right',
            margin: [0, 4]
          },
          darkHeader: {
            font: 'Gothic',
            color: '#fff',
            alignment: 'center',
            fillColor: '#333',
            margin: [0, 4]
          },
          darkCol2: {
            font: 'Gothic',
            color: '#fff',
            alignment: 'center',
            fillColor: '#222',
            margin: [0, 4]
          },
          grayCol: {
            font: 'Gothic',
            color: '#000',
            alignment: 'center',
            fillColor: '#ddd',
            margin: [0, 4]
          },
          simpleCol: {
            font: 'Gothic',
            alignment: 'center',
            margin: [0, 4]
          },
          simpleSymbolCol: {
            alignment: 'center',
            margin: [0, 4]
          },
          graySymbolCol: {
            color: '#000',
            alignment: 'center',
            fillColor: '#ddd',
            margin: [0, 4]
          },
          Footnote: {
            font: 'Gothic',
            color: '#383838',
            alignment: 'left',
            fontSize: 9,
            margin: [0, 4]
          },
        }
      };
    }
    return DOCdefinition;
  };

  calculatePrices()
  {
    let priceForX = this.currencies.origin.prices.map((element) => {
	    return element*Number(this.JSONanswer.amount);
    }); //Стоимость для x
    let temp_array1 = Array.from(priceForX);
    let priceDiscounted = temp_array1.splice(-3);
    let temp_array2 = [(priceDiscounted[0] - priceDiscounted[0]*Number(this.JSONanswer.discount_year)/100),(priceDiscounted[1] - priceDiscounted[1]*Number(this.JSONanswer.discount_3years)/100),(priceDiscounted[2] - priceDiscounted[2]*Number(this.JSONanswer.discount_lifetime)/100)];
    priceDiscounted = temp_array1.concat(temp_array2); //Результат со скидкой

    let pdfTablePrices = {};

    if(this.withConversion == 0)
    {
      temp_array1 = [];
      for (let i = 0; i < priceDiscounted.length; i++)
      {
        temp_array1[i] = (priceDiscounted[i]/this.JSONcurrencies.durations[i]*Number(this.JSONanswer.amount).toFixed(2));
      };
      pdfTablePrices =
      {
        priceForX: priceForX,
        priceDiscounted: priceDiscounted,
        priceMonthUser: temp_array1
      };
    }
    else
    {
      temp_array1 = [];
      temp_array2 = [];
      let bankTarrif = priceDiscounted.map((element) => {
        return Number(((element*1.038)*Number(this.JSONanswer.conversion_rate)).toFixed(2));
      }); //Bank array
      let paypalTarrif = priceDiscounted.map((element) => {
        return Number(((element*1.029)*Number(this.JSONanswer.conversion_rate)).toFixed(2));
      }); //Paypal array
      for (let i = 0; i < bankTarrif.length; i++)
      {
        temp_array1[i] = Number((bankTarrif[i]/(this.JSONcurrencies.durations[i]*Number(this.JSONanswer.amount)) ).toFixed(2) );
      };
      for (let i = 0; i < paypalTarrif.length; i++)
      {
        temp_array2[i] = Number((paypalTarrif[i]/(this.JSONcurrencies.durations[i]*Number(this.JSONanswer.amount)) ).toFixed(2) );
      };

      pdfTablePrices =
      {
        priceForX: priceForX,
        priceDiscounted: priceDiscounted,
        priceBank: bankTarrif,
        pricePaypal: paypalTarrif,
        priceMonthUser1: temp_array1,
        priceMonthUser2: temp_array2
      }
    }

    return pdfTablePrices;
  }

  priceMonthCalculate(month){
    let calcResult = {};

    let licenseCount = this.JSONanswer.amount;
    let monthCount = !!month ? month : 120;

    calcResult.price = licenseCount * this.monthPricesData[month].price;
    calcResult.discount = calcResult.price * (+this.monthPricesData[month].discountPercent / 100);
    calcResult.priceWithDiscount = calcResult.price - calcResult.discount;

    for(let payment in this.paymentTypePercent){
      calcResult[payment] = {};

      calcResult[payment].price = calcResult.priceWithDiscount + (calcResult.priceWithDiscount * (this.paymentTypePercent[payment] / 100));
      calcResult[payment].price = Math.floor(calcResult[payment].price * 100) / 100;

      calcResult[payment].priceMonth = calcResult[payment].price / monthCount;
      calcResult[payment].priceMonth = Math.floor(calcResult[payment].priceMonth * 100) / 100;

      calcResult[payment].licensePriceMonth = calcResult[payment].priceMonth / licenseCount;
      calcResult[payment].licensePriceMonth = Math.floor(calcResult[payment].licensePriceMonth * 100) / 100;
    }
    return calcResult;
  }

  getPricesData(months){
    let result = {};
    if(!months || !Array.isArray(months) || !months.length){
      result = this.monthPricesData;
    }
    else{
      months.forEach(function(item) {
        if(typeof this.monthPricesData[item] !== "undefined"){
          result[item] = this.monthPricesData[item];
        }
      });
    }
    return result;
  }
}

module.exports = DocBuilder;
