const router = require('express').Router();
const { saveNotificationsTokenToUser, notify, getAll: getAllNotifications } = require('../queries/notifications');
const { success, error } = require('../assets/responses');
const { Expo } = require('expo-server-sdk');
const { getAll } = require('../queries/delegates');

router.get('/', (req, res) => {
  const { page = 1, limit = 12 } = req.query;
  getAllNotifications(req.user.lc, page, limit)
    .then(respone => res.status(200).json(success(respone)))
    .catch(err => res.status(400).json(error(err)));
});

router.post('/saveToken', (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json(error("YOu are missing a required paramater, (token)."));

  saveNotificationsTokenToUser(token, req.user.id)
    .then(respone => res.status(200).json(success(respone)))
    .catch(err => res.status(400).json(error(err)));
});

router.post('/notify', (req, res) => {
  const { body, title } = req.body;
  let { lc } = req.body;
  const chosenLC = lc;
  const errors = [];
  if (lc === 'All')
    lc = null;

  const message = {
    title,
    body,
    _displayInForeground: true,
    sound: 'default',
    to: [],
  }
  let done = true;

  getAll(1, 1000, lc)
    .then(delegates => {
      delegates.map(delegate => {
        if (delegate.notificationToken)
          message.to.push(delegate.notificationToken)
      });
      if (message.to.length > 0)
        done = notify(message, req.user.name, chosenLC);
    })
    .catch(err => errors.push(`${err}.`));

  if (errors.length > 1 && done) {
    return res.status(200).json(success(`Some of the delegates will recieve the notifications & others not for some problems, ${JSON.stringify(errors)}`));
  } else if (errors.length > 1) {
    return res.status(403).json(error(`Something went wrong while sending notifications, try again later, ${JSON.stringify(errors)}`));
  } else {
    return res.status(200).json(success(done));
  }
});

module.exports = router;
