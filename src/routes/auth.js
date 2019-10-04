const router = require('express').Router();

const { logIn, forgotPassword } = require('../queries/auth');
const { success, error } = require('../assets/responses');

router.get('/forgot/:email', async (req, res) => {
  const { email } = req.params;
  if (!email)
    return res.status(400).json(error('Email field it required!'))

  try {
    return res.status(200).json(success(await forgotPassword(email)));
  } catch (ex) {
    return res.status(403).json(error(ex));
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json(error('Email address & Password are required.'));

  logIn(email, password)
    .then(result => res.set('token', result.token).status(200).json(success(result.user)))
    .catch(err => res.status(403).json(error(err)))
});

module.exports = router;
