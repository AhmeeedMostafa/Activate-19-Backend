const db = require('../firestore');
const currentDate = require('../assets/currentDate');
const { findDelegateById, updateUserById } = require('./delegates');
const fetch = require('node-fetch');

const collection = db.collection('notifications');

// For retrieving all the available items of merchandise
const getAll = async (userLc, page, limit) => {
  try {
    const offset = (limit / 2) * (page - 1);
    const notificationsAll = await collection.where('lc', '==', 'All').orderBy('time', 'desc').limit(limit / 2).offset(offset).get();
    const notificationsLC = await collection.where('lc', '==', userLc).orderBy('time', 'desc').limit(limit / 2).offset(offset).get();

    const allNotifications = [];
    notificationsLC.docs.map(doc => allNotifications.push({ id: doc.id, ...doc.data() }))
    notificationsAll.docs.map(doc => allNotifications.push({id: doc.id, ...doc.data()}))

    if (allNotifications.empty)
      return Promise.resolve([])

    return Promise.resolve(allNotifications)
  } catch (ex) {
    return Promise.reject(ex)
  }
}

// For saving the user token on db
const saveNotificationsTokenToUser = (notificationToken, userId) => {
  return updateUserById(userId, { notificationToken })
}

// notify the user & add the notification to DB
const notify = async (messages, addedByName) => {
  const url = 'https://expo.io/--/api/v2/push/send';
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(messages),
  });
  await response.json();
  return addNotificationToDB({ title: message.title, body: message.body, lc: message.lc }, addedByName);
}

// For adding an item into the collection of the merchandise
const addNotificationToDB = (notificationDetails, addedByName) => (
  collection.add({ ...notificationDetails, time: currentDate, addedBy: addedByName })
    .then(_result => Promise.resolve('Notification has been added successfully y ryasaaaaa.'))
    .catch(err => Promise.reject(`${err}`))
);

module.exports = { getAll, addNotificationToDB, saveNotificationsTokenToUser, notify }
