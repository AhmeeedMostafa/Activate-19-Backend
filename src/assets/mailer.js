const nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ahmed.khallaf2@aiesec.net',
    pass: 'AIESECpass1'
  }
});

module.exports = transporter;
