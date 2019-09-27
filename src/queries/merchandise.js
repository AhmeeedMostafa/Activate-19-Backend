const db = require('../firestore');
const { findDelegateById } = require('./delegates');
const currentDate = require('../assets/currentDate');

// For retrieving all the available items of merchandise
const getAll = async () => {
  try {
    const merchandise = await db.collection('merchandise').where('deletedAt', '==', null).orderBy('addedAt').get();
    if (merchandise.empty)
      return Promise.resolve([])

    const allItems = [];
    merchandise.forEach(item => allItems.push({ id: item.id, ...item.data() }))
    return Promise.resolve(allItems)
  } catch (ex) {
    return Promise.reject(ex)
  }
}

// For adding an item into the collection of the merchandise
const addItem = (itemDetails, addedById) => (
  db.collection('merchandise').add({ ...itemDetails, addedAt: currentDate, addedBy: db.doc(`delegates/${addedById}`), deletedAt: null, deletedBy: null })
    .then(_result => Promise.resolve('Item has been added successfully.'))
    .catch(err => Promise.reject(`${err}`))
);

// For ordering merchandise
const order = async (userId, items) => {
  const userRef = db.collection('delegates').doc(userId);
  return db.runTransaction(async t => {
    try {
      const user = await t.get(userRef);
      if (!user.exists)
        return await Promise.reject('We couldnt find your account in our records please login again & try once more.')

      const merchandise = user.data().merchandise || [];
      items.forEach(item => merchandise.push({ item: db.doc(`merchandise/${item.id}`), quantity: item.quantity }))
      t.update(userRef, { merchandise });
      return await Promise.resolve(true);
    } catch (ex) {
      return await Promise.reject(ex);
    }
  })
}

// For retrieving the user's cart whether for OC or the user him self.
const userCart = async (userId) => {
  try {
    const user = await findDelegateById(userId);
    return await Promise.resolve(user.merchandise || []);
  }
  catch (err) {
    return await Promise.reject(`${err}`);
  }
}

module.exports = { getAll, order, addItem, userCart }
