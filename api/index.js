#!/usr/bin/env node
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');
const morgan = require('morgan');

const PORT = process.env.PORT || 3001;

const corsOptions = { origin: true };

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(morgan('combined'));

transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

let orderNumber = 1;
const makeStr = (arr) => arr.join(', ');

app.post('/api/send', async (req, res) => {
  try {
    const data = req.body;
    console.log(req.body);
    const { email, present, time, mark, amount, mileAge, phone, transmition } = data;
    const htmlBody = (
      `<h2>Заказ №${orderNumber}</h2>
      <table>
        <tbody>
          <tr>
            <td>Выберете подарок:</td>
            <td>${makeStr(present)}</td>
          </tr>
          <tr>
            <td>Как скоро вы планируете покупку автомобиля?:</td>
            <td>${makeStr(time)}</td>
          </tr>
          <tr>
            <td>Какие марки:</td>
            <td>${makeStr(mark)}</td>
          </tr>
          <tr>
            <td>Трансмиссия:</td>
            <td>${makeStr(transmition)}</td>
          </tr>
          <tr>
            <td>Какой ваш бюджет на покупку автомобиля?:</td>
            <td>${makeStr(amount)}</td>
          </tr>
          <tr>
            <td>Пробег:</td>
            <td>${makeStr(mileAge)}</td>
          </tr>
          <tr>
            <td>Телефон:</td>
            <td>${phone}</td>
          </tr>
        </tbody>
      </table>`
    );

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: email,
      subject: `Ваш заказ автомобиля`,
      text: '',
      html: htmlBody,
    });

    orderNumber += 1;

    return res.status(200).end();
  } catch (err) {
    console.error(err);
    return res.status(500).end();
  }
});

const start = async () => {
  try {
    app.listen(PORT);
    console.log(`Server is running on port ${PORT}.`);
  } catch (err) {
    console.error(err);
  }
};

start();
