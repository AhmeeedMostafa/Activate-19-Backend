require('dotenv').config()
const express = require("express");
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

const { verifyUser } = require('./src/middlewares/user');
const auth = require('./src/routes/auth');
const constants = require('./src/routes/constants');
const delegates = require('./src/routes/delegates');
const agenda = require('./src/routes/agenda');
const merchandise = require('./src/routes/merchandise');
const notifications = require('./src/routes/notifications');
const orders = require('./src/routes/orders');

const { success } = require('./src/assets/responses');

// const creds = JSON.stringify({
//   type: process.env.type,
//   project_id: process.env.project_id,
//   private_key_id: process.env.private_key,
//   private_key: process.env.private_key,
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: process.env.auth_uri,
//   token_uri: process.env.token_uri,
//   auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//   client_x509_cert_url: process.env.client_x509_cert_url
// });

// console.log(creds);

// const fs = require('fs');

// fs.writeFile('client_secret.json', creds, function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// .
// 0});

const app = express();
const port = process.env.PORT || '3000';

// Parsing Cookies to be included explicity in the req. object.
app.use(cookieParser())

// Parsing Body to be included explicity in the req. object.
app.use(bodyParser.json());

app.set('port', port);

app.use('/auth', auth);

app.use(verifyUser);

app.use('/delegates', delegates);
app.get('/current_user', (req, res) => res.status(200).json(success(req.user)))
app.use('/agenda', agenda);
app.use('/constants', constants);
app.use('/merchandise', merchandise);
app.use('/notifications', notifications);
app.use('/orders', orders);

app.use(function (_, res) {
  res.status(404).send("404, Invalid request page not found.")
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
