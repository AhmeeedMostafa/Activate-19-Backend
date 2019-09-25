const express = require("express");
const cookieParser = require('cookie-parser')

const app = express();
const port = normalizePort(process.env.PORT || '3000');

app.use(cookieParser())

app.set('port', port);

app.get('/', (req, res) => {
  // res.send("HELLO WORD");
  res.json({"hey": "fine"})
})

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(port, () => console.log(`Server is running on port ${port}`))
