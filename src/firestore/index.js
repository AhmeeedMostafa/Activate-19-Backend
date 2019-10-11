const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.project_id,
        clientEmail: process.env.client_email,
        privateKey: process.env.private_key.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.DB_URL,
});

const db = admin.firestore();

module.exports = db;
