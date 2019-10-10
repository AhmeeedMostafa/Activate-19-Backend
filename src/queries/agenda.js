const db = require('../firestore');
const { sortObject, daysNumbering } = require('../assets/utilities');

const collection = db.collection('agenda');

const getAll = () => (
  collection.get()
    .then((snapshot) => {
      if (snapshot.empty)
        return Promise.resolve([]);

      const agenda = [];
      snapshot.forEach(doc => agenda.push({ day: daysNumbering(doc.id), data: [sortObject(doc.data())] }));
      return Promise.resolve(agenda);
    })
    .catch((err) => Promise.reject(`Error: ${err.message}`))
);


// Adding new session to the current sessions
const addSession = (day, time, sessionInfo) => {
  const dayRef = collection.doc(daysNumbering(day));

  return db.runTransaction(async t => {
    const doc = await t.get(dayRef);
    const timeSessions = doc.data()[time];
    timeSessions.push({ ...sessionInfo });
    t.update(dayRef, { [time]: timeSessions });
    return Promise.resolve(timeSessions);
  })
    .then(result => Promise.resolve(result))
    .catch(err => Promise.reject(`Error: ${err.message}`))
}

// Shifting the current agenda sessions
const shiftAgenda = (shiftValue, shiftingFrom, day) => {
  try {
    return db.runTransaction(t => {
      const dayRef = collection.doc(day);
      return t.get(dayRef)
        .then(dayTimes => {
          const shiftedSessions = {};

          times.map(time => {
            const timeSessions = dayTimes.data()[time];
            if (!shiftedSessions[time])
              shiftedSessions[time] = [];

            if (moment(time, "hh:mm A").isSameOrAfter(shiftingFrom, "hh:mm A")) {
              timeSessions.map(timeSession => {
                timeSession.startsAt = moment(timeSession.startsAt, "hh:mm A")
                  .add(shiftValue, 'minutes')
                  .format('hh:mm A');
                const increasedHourTime = moment(time, "hh:mm A")
                  .add(1, 'hours')
                  .format('hh:mm A');
                if (moment(increasedHourTime).isAfter(times[times.length - 1]))
                  shiftedSessions['ZZ'].push(timeSession);                  
                else if (moment(increasedHourTime).isSameOrAfter(timeSession.startsAt))
                  shiftedSessions[increasedHourTime].push(timeSession);
                else
                  shiftedSessions[time].push(timeSession);
              });
            } else {
              shiftedSessions[time].push(dayTimes[time]);
            }
          });

          console.log("HELLOAWEWE");

          t.update(dayRef, shiftedSessions);
        });
    })
    .then(_res => Promise.resolve('Agenda shifted successfully y ngm/a.'));
    
    //Notify there is change in agenda...
  } catch (err) {
    return Promise.reject(`${err}`);
  }
}

module.exports = { getAll, addSession, shiftAgenda }
