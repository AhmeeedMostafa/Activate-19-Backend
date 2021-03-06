const router = require('express').Router();

const { success, error } = require('../assets/responses');
const constants = require('../assets/constants');

router.get('/', (_, res) => {
  res.status(200).json(success(constants))
});

router.get('/:type', (req, res) => {
  const { type } = req.params;

  if (!type || !Object.keys(constants).includes(type))
    return res.status(400).json(error("Invalid/No value is provided for (type) property. "))

  res.status(200).json(success(constants[type]))
});

module.exports = router;
