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
app.use('/agenda', agenda);
app.use('/constants', constants);
app.use('/merchandise', merchandise);

app.use(function (_, res) {
  res.status(404).send("[404], Invalid request page not found!")
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
