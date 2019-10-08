const db = require('../firestore');
const currentDate = require('../assets/currentDate');

const collection = db.collection('notifications');

// For retrieving all the available items of merchandise
const getAll = async (userLc) => {
  try {
    const notificationsAll = await collection.where('lc', '==', 'All').orderBy('time', 'desc').get();
    const notificationsLC = await collection.where('lc', '==', userLc).orderBy('time', 'desc').get();
    const allNotifications = [...notificationsLC.data(), ...notificationsAll.data()];
    if (allNotifications.empty)
      return Promise.resolve([])

    const finalAllNotifications = [];
    allNotifications.forEach(notification => finalAllNotifications.push({ id: notification.id, ...notification.data() }))
    return Promise.resolve(allNotifications)
  } catch (ex) {
    return Promise.reject(ex)
  }
}

// For adding an item into the collection of the merchandise
const addNotification = (notificationDetails, addedByName) => (
  collection.add({ ...notificationDetails, time: currentDate, addedBy: addedByName })
    .then(_result => Promise.resolve('Notification has been added successfully y ryasaaaaa.'))
    .catch(err => Promise.reject(`${err}`))
);

module.exports = { getAll, addNotification }
