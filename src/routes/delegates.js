const router = require('express').Router();

const { findDelegateById, toggleStatus, getAll, updateUserByEmail } = require('../queries/delegates');
const { success, error } = require('../assets/responses');
const { checkUserRolePartially } = require('../assets/utilities');
const { isUserPermittedTo } = require('../middlewares/user');
const { statuses, permissions } = require('../assets/constants');
const transporter = require('../assets/mailer');

// Retrieving all the delegates
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 11;
  const { phone } = req.query;
  let { lc } = req.query;

  if (!checkUserRolePartially('oc', 'type'))
    lc = req.user.lc;

  getAll(page, limit, lc, phone)
    .then((delegates) => res.status(200).json(success(delegates)))
    .catch((err) => res.status(403).json(error(`Error: ${err}.`)))
});

router.get('/send_qr', (req, res) => {
  let x = 0;
  getAll(1, 650)
    .then((delegate) => {
      x++;
      let mailOptions = {
        from: 'ahmed.khallaf2@aiesec.net',
        to: delegate.email,
        subject: 'Your Activate19 Conference QR Code for checking-in!',
        html: `<img src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=ActCU-${delegate.id}" />`
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(x, error);
        } else {
          console.log('Email sent: ' + x + ' - '+ info.response);
        }
      });
    
    })
    .catch((err) => res.status(403).json(error(`Error: ${err}.`)))
});

// Retrieving a single delegate
router.get('/:id', (req, res) => {
  const { id } = req.params;

  findDelegateById(id)
    .then(delegate => checkUserRolePartially('oc', 'type')
      || delegate.lc == req.user.lc
      ? res.status(200).json(success(delegate))
      : res.status(403).json(error('You are not allowed to do this operation.')))
    .catch(err => res.status(403).json(error(err)));
});

router.patch('/photo', (req, res) => {
  const { email, photo } = req.body;
  if (!email || !photo)
    return res.status(400).json(error("You are missing one of the (email, photo) properties."));

  updateUserByEmail(email, { photo })
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)));
});

// Toggle Delegate status between (Not-attended) & (Checked-in) & (Checked-out).
// isUserPermittedTo middleware is checking if the user has permission to change the status or not.
router.patch('/status', isUserPermittedTo(permissions.SCAN_OPERATIONS), (req, res) => {
  const { id, status } = req.body;

  if (!id || !status)
    return res.status(400).json(error("You are missing one of the (id, status) properties."));
  if (!statuses.includes(status))
    return res.status(400).json(error("Invalid value is provided for (status) property."));

  toggleStatus(id, status)
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)));
});

module.exports = router;
