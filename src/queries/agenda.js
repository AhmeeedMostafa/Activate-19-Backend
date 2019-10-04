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

// Modifying the current sessions
const modifyTimeSessions = (day, time, timeSessions) => {
  return collection.doc(daysNumbering(day)).update({ [time]: timeSessions })
    .then(result => Promise.resolve(timeSessions))
    .catch(err => Promise.reject(`Error: ${err.message}`))
}

module.exports = { getAll, addSession, modifyTimeSessions }
