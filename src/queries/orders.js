const db = require('../firestore');
const currentDate = require('../assets/currentDate');

const collection = db.collection('notifications');

// For retrieving all the available items of merchandise
const getAll = (page, limit, userEmail = null) => {
    const offset = limit * (page - 1);

    let query = collection.orderBy('orderedAt', 'desc')
        .limit(limit)
        .offset(offset);

    if (userEmail)
        query = query.where('email', '==', userEmail);

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
};

module.exports = { getAll }
