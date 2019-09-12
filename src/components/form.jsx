import React, { Component } from 'react'

export default class Form extends Component {
  render() {
      return (
        <div className="container-contact100">
          <div className="wrap-contact100">
            <form className="contact100-form validate-form">
              <span className="contact100-form-title">
                Оформление Коммерческого Предложения
              </span>
              <div className="wrap-input100 validate-input bg1">
                <span className="label-input100">Имя клиента или компании клиента *</span>
                <input className="input100" type="text" name="name" placeholder="Напишите имена на языке клиента" />
              </div>
              <div className="wrap-input100 validate-input bg1 rs1-wrap-input100">
              <span className="label-input100">Язык КП*</span>
              <div>
                <select className="js-select2" name="service">
                  <option>Выберите одно</option>
                  <option>Русский</option>
                  <option>Английский</option>
                  <option>Португальский</option>
                </select>
              </div>
              </div>
              <div className="wrap-input100 bg1 rs1-wrap-input100">
                  <span className="label-input100">Продавец *</span>
                  <div>
                    <select className="js-select2" name="service">
                      <option>Выберите одно</option>
                      <option>Кайо</option>
                      <option>Александер</option>
                      <option>Владмир</option>
                      <option>Кирилл</option>
                    </select>
                  </div>
              </div>
              <div className="wrap-input100 bg1 rs1-wrap-input100">
                <span className="label-input100">Валюта Перевода *</span>
                <div>
                  <input type="radio" name="origin_currency" defaultValue="RUB" defaultChecked />RUB<br />
                  <input type="radio" name="origin_currency" defaultValue="USD" />USD<br />
                </div>
                <span className="label-input100">Валюта Клиента *</span>
                <div>
                <select className="js-select2" name="service">
                  <option>Выберите одно</option>
                  <option>RUB</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>BRL</option>
                </select>
                </div>
              </div>
              <div className="wrap-input100 bg1 rs1-wrap-input100">
                <span className="label-input100">Курс валют</span>
                <textarea className="input100" name="service" placeholder="Если RUB к RUB или USD к USD напишите 1" defaultValue={""} />
              </div>
              <div className="container-contact100-form-btn">
                <button className="contact100-form-btn">
                  <span>
                    Оформить
                    <i className="fa fa-long-arrow-right m-l-7" aria-hidden="true" />
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      );
    }
  }
