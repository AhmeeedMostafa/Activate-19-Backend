const router = require('express').Router();

const { getAll, addSession, shiftAgenda } = require('../queries/agenda');
const { success, error } = require('../assets/responses');
const { days, tracks, permissions } = require('../assets/constants');

// Getting all the agenda route
router.get('/', (_, res) => {
  getAll()
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)))
});

// Adding new session to the agenda's time route
// router.post('/', isUserPermittedTo(permissions.ADD_SESSION), (req, res) => {
router.post('/', (req, res) => {
  const { day, hour, minute, title, duration, faci, hall, track } = req.body;
  if (!day || !hour || !minute || !title || !duration || !faci || !hall || !track)
    return res.status(400).json(error("You are missing some property (day, hour, minute, title, duration, faci, hall, track)."))
  if (!days.includes(day))
    return res.status(400).json(error("Invalid value is provided for day it must be in this form (Thrusday) in the range (Thursday - Saturday)."))
  if (!hours.includes(hour))
    return res.status(400).json(error("Invalid value is provided for time it must be in this form (04 PM) in the range (07 AM - 11 PM)."))
  if (!hours.includes(minute))
    return res.status(400).json(error("Invalid value is provided for minute it must be in this form (00 ,15, 30, 45) in the range (07:00 AM - 01:00 AM)."))
  if (!tracks.includes(track))
    return res.status(400).json(error("Invalid value is provided for Track it must be one of (All, LCPs, EB, MM, Members)."))

  //04 AM
  const [onlyHour, onlyTimeZone] = hour.split(' ');
  const time = `${onlyHour}:00 ${onlyTimeZone}`;
  const startsAt = `${onlyHour}:${minute} ${onlyTimeZone}`;
  const by = req.user.name;

  addSession(day, time, { title, startsAt, duration, faci, hall, track, by })
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(success(err)))
});

router.patch('/shiftAgenda', (req, res) => {
  const { shiftValue, shiftFromHour, shiftFromMinute, day } = req.body;

  if (!shiftValue || !shiftFromHour || !shiftFromMinute || !day)
    return res.status(400).json(error("You are missing some property (Shift value, Shift from hour, Shift from minute, day)."))
  
  const [onlyHour, onlyTimeZone] = shiftFromHour.split(' ');
  const shiftingFrom = `${onlyHour}:${shiftFromMinute} ${onlyTimeZone}`;

  shiftAgenda(shiftValue, shiftingFrom, day)
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
