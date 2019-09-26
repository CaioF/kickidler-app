import React, { Component } from 'react'

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      client: "",
      amount: "",
      lang: "",
      seller: "",
      origin_currency: "",
      conversion_currency: "",
      conversion_rate: "",
      discount_year: "",
      discount_3years: "",
      discount_lifetime: ""
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    const { target: { name, value } } = event;
    this.setState({ [name]: value, event: event });
  }

  handleClick(event) {
    console.log(this.state);
    fetch('http://192.168.19.217:8008/send', {
      body: JSON.stringify(this.state),
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'content-type': 'application/json; charset=utf-8'
      },
      method: 'POST',
      mode: 'cors',
      redirect: 'follow',
      referrer: 'no-referrer',
    })
      .then(function (response) {
        console.log(response);
        if (response.status === 200) {
          window.location='http://192.168.19.217:8008/send';
        } else {
          alert('Ошибка сервера!\nПроверьте что все поля заполнены правильно');
        }
        // you cannot parse your "success" response, since that is not a valid JSON
        // consider using valid JSON req/resp pairs.
        // return response.json();
      });

  }

  render() {
      return (
      <div className="container-contact100">
        <div className="wrap-contact100">
          <form name ="myForm" className="contact100-form">
            <span className="contact100-form-title">
              Оформление Коммерческого Предложения
            </span>
            <div className="wrap-input100">
              <span className="label-input100">Имя клиента или компании клиента *</span>
              <input className="input100" type="text" name="client" value={this.state.client} onChange={(event)=>this.handleInputChange(event)} placeholder="Напишите на языке, в котором КП будет оформлено" />
            </div>
            <div className="wrap-input100">
              <span className="label-input100">Количество лицензий *</span>
              <input className="input100" type="number" name="amount" value={this.state.amount} onChange={(event)=>this.handleInputChange(event)} placeholder="Напишите число" />
            </div>
            <div className="wrap-input100 rs1-wrap-input100">
            <span className="label-input100">Язык КП *</span>
              <div>
                <select name="lang" value={this.state.value} onChange={(event)=>this.handleInputChange(event)}>
                  <option>Выберите одно</option>
                  <option>Русский</option>
                  <option>Английский</option>
                  <option>Португальский</option>
                </select>
              </div>
            </div>
            <div className="wrap-input100 rs1-wrap-input100">
                <span className="label-input100">Продавец *</span>
                <div>
                  <select name="seller" value={this.state.seller} onChange={(event)=>this.handleInputChange(event)}>
                    <option>Выберите одно</option>
                    <option>Кайо</option>
                    <option>Александр</option>
                    <option>Владмир</option>
                    <option>Кирилл</option>
                  </select>
                </div>
            </div>
            <div className="wrap-input100 rs1-wrap-input100">
              <span className="label-input100">Валюта Перевода *</span>
              <div>
                  <select name="origin_currency" value={this.state.origin_currency} onChange={(event)=>this.handleInputChange(event)}>
                  <option>Выберите одно</option>
                  <option>RUB</option>
                  <option>USD</option>
                </select>
              </div>
              <span className="label-input100">Валюта Клиента *</span>
              <div>
                <select name="conversion_currency" value={this.state.conversion_currency} onChange={(event)=>this.handleInputChange(event)}>
                  <option>Выберите одно</option>
                  <option>Без конверции валют</option>
                  <option>EUR-€</option>
                  <option>BRL-R$</option>
                  <option>INR-₹</option>
                  <option>KZT-₸</option>
                  <option>BYR-Br</option>
                  <option>GBP-£</option>
                  <option>CNY-¥</option>
                </select>
              </div>
            </div>
            <div className="wrap-input100 rs1-wrap-input100">
              <span className="label-input100">Курс валют</span>
              <textarea className="input100" name="conversion_rate" value={this.state.conversion_rate} onChange={(event)=>this.handleInputChange(event)} placeholder="Если валюта клиента = RUB или USD — оставьте это поле пусто и выберите 'Без конверции валют' в поле 'Валюта Клиента'"/>
            </div>
            <div className="wrap-input100">
              <span className="label-input100">Скидки *</span>
              <input className="input100" type="number" name="discount_year" value={this.state.discount_year} onChange={(event)=>this.handleInputChange(event)} placeholder="Скидка на годовых — 0 = без скидки, 100 = бесплатно" />
              <input className="input100" type="number" name="discount_3years" value={this.state.discount_3years} onChange={(event)=>this.handleInputChange(event)} placeholder="Скидка на 3 годовых — 0 = без скидки, 100 = бесплатно" />
              <input className="input100" type="number" name="discount_lifetime" value={this.state.discount_lifetime} onChange={(event)=>this.handleInputChange(event)} placeholder="Скидка на бессрочных — 0 = без скидки, 100 = бесплатно" />
            </div>
            <div className="container-contact100-form-btn">
              <button type="button" className="contact100-form-btn" onClick={(event)=>this.handleClick(event)}>
                <span>
                  Оформить
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
