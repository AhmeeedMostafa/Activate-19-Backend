const router = require('express').Router();
const db = require('../firestore');

const { getAll, addSession, modifyTimeSessions } = require('../queries/agenda');
const { isUserPermittedTo } = require('../middlewares/user');
const { success, error } = require('../assets/responses');
const { times, days, tracks } = require('../assets/constants');

// Getting all the agenda route
router.get('/', (_, res) => {
  getAll()
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)))
});

// Adding new session to the agenda's time route
router.post('/', isUserPermittedTo('add_session'), (req, res) => {
  const { day, time, title, startsAt, duration, faci, by, hall, track } = req.body;
  if (!day || !time || !title || !startsAt || !duration || !faci || !by || !hall || !track)
    return res.status(400).json(error("You are missing some property (day, time, title, startsAt, duration, faci, by, hall, track)."))
  if (!days.includes(day))
    return res.status(400).json(error("Invalid value is provided for day it must be in this form (Thrusday) in the range (Thursday - Saturday)."))
  if (!times.includes(time))
    return res.status(400).json(error("Invalid value is provided for time it must be in this form (04:00 PM) in the range (07:00 AM - 01:00 AM)."))
  if (!tracks.includes(track))
    return res.status(400).json(error("Invalid value is provided for Track it must be one of (All, LCPs, EB, MM, Members)."))

  addSession(day, time, { title, startsAt, duration, faci, hall, track, by })
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(success(err)))
});

router.patch('/', isUserPermittedTo('edit_session'), (req, res) => {
  const { day, time, timeSessions } = req.body;

  if (!day || !time || !timeSessions)
    return res.status(400).json(error("You are missing some property (day, time, timeSessions)."))
  if (!days.includes(day))
    return res.status(400).json(error("Invalid value is provided for day it must be in this form (Thursday) in the range (Thursday - Saturday)."))
  if (!times.includes(time))
    return res.status(400).json(error("Invalid value is provided for time it must be in this form (04:00 PM) in the range (07:00 AM - 01:00 AM)."))

  modifyTimeSessions(day, time, timeSessions)
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(success(err)))
});

// For adding the times inside the days
// router.get('/addthem', (req, res, next) => {
//   const batch = db.batch()
//   const rf = db.collection('agenda').doc('3. Saturday');
//   times.forEach(time => { batch.update(rf, { [time]: [] }); console.log('Done', time) })
//   batch.commit().then(x => console.log(x))
//   console.log('done');
//   res.send('A');
// });

module.exports = router;
