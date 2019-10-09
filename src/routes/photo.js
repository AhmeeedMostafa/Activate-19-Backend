const router = require('express').Router();
const firebase = require('firebase/app');
require('firebase/firebase-storage');
const { updateUserById } = require('../queries/delegates');
const { error, success } = require('../assets/responses');

router.post('/', (req, res) => {
  const { photo } = req.body;

  const firebaseConfig = {
    apiKey: process.env.FIRE_API_KEY,
    authDomain: "activate-19-aiesec-cu.firebaseapp.com",
    databaseURL: process.env.DB_URL,
    projectId: "activate-19-aiesec-cu",
    storageBucket: "activate-19-aiesec-cu.appspot.com",
    messagingSenderId: "754570730113",
    appId: "1:754570730113:web:a3addae95f93710822cb80"
  };
  firebase.initializeApp(firebaseConfig);

  console.log(photo);
  console.log(photo._parts[0][1]);
  console.log(photo.name);
  console.log(photo.uri);
  console.log(photo.type);
  console.log(photo['type']);
  console.log(photo['name']);
  
  if (!photo)
    return res.status(400).json(error("Please select the photo with size less than 3.5 MB to upload it."));

  const realphotoName = photo.name;
  // const photoExt = realphotoName.slice(realphotoName.lastIndexOf("."), realphotoName.length);
  // const allowedphotoExts = ['.jpg', '.jpeg', '.png'];

//   if (!allowedphotoExts.includes(photoExt.toLowerCase()))
//     return res.status(400).json(error("Only JPG, JPEG & PNG photos are allowed for uploading."));
// console.log('works!');
  const newphotoName = `kllk.jpg`;

  const storage = firebase.storage();
  console.log('before uploading works!');
  const upload = storage.ref(`photos/${newphotoName}`).put(photo._parts[0][1]);

console.log('before state!!!');
  return upload.on('state_changed', null,
    (error) => (
      res.status(400).json(error(error.message || 'Something went wrong, please report the COD & try again later.'))
    ),
    () => {
      storage.ref('photos').child(newphotoName).getDownloadURL()
        .then(url => {
          updateUserById(req.user.id, { photo: url })
            .then(_ => res.status(200).json(success(url)))
        })
        .catch(err => res.status(403).json(error(err)))
    });
});

module.exports = router;
