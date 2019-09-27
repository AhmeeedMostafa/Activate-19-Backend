const db = require('../firestore');
const currentDate = require('../assets/currentDate');

const collection = db.collection('delegates');

// Retrieve all the delegates from the database
const getAll = (page, limit, lc = null, phone = null) => {
  const offset = limit * (page - 1);

  let query = collection.orderBy('registeredAt', 'desc')
    .limit(limit)
    .offset(offset);

  if (lc)
    query = query.where('lc', '==', lc);
  if (phone)
    query = query.where('phone', '==', phone);

  return query.get()
    .then((snapshot) => {
      if (snapshot.empty)
        return Promise.resolve([]);

      const data = [];
      snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
      return Promise.resolve(data);
    })
    .catch((err) => {
      return Promise.reject(`${err}`);
    });
}

// Finding the delegate by email
const findDelegateByEmail = (email, returnFields = true) => (
  collection.where('email', '==', email).get()
    .then(snapshot => {
      if (snapshot.empty)
        return Promise.reject('Invalid Email address is provided.');

      const user = snapshot.docs[0];
      return Promise.resolve(returnFields ? { id: user.id, ...user.data() } : true);
    }).catch(err => {
      return Promise.reject(`${err}`);
    })
);


// Finding Delegate by #id
const findDelegateById = (id, returnFields = true) => (
  collection.doc(String(id)).get()
    .then(snapshot => {
      if (!snapshot.exists)
        return Promise.reject('No delegate found with this resource.');

      return Promise.resolve(returnFields ? { id, ...snapshot.data() } : true);
    }).catch((err) => {
      return Promise.reject(`${err}`);
    })
);

// Toggle Not-Attended/Checked-In/Checked-Out status
const toggleStatus = (id, status) => {
  const userRef = collection.doc(id);

  return db.runTransaction(t => (
    t.get(userRef)
      .then(user => {
        if (user.data().status == status)
          return Promise.reject(`Delegate is already (${status}).`);

        t.update(userRef, { status, lastUpdated: currentDate });
        return Promise.resolve(`Status has changed to (${status})`);
      })
      .catch(err => Promise.reject(err.message ? 'User not found with this resource.' : err))
  ))
}

module.exports = { findDelegateById, findDelegateByEmail, toggleStatus, getAll };