const router = require('express').Router();

const { findDelegateById, toggleStatus, getAll } = require('../queries/delegates');
const { success, error } = require('../assets/responses');
const { checkUserRolePartially } = require('../assets/utilities');
const { userCanAct } = require('../middlewares/user');
const { statuses } = require('../assets/constants');

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

// Toggle Delegate status between (Not-attended) & (Checked-in) & (Checked-out).
// userCanAct middleware is checking if the user has permission to change the status or not.
router.patch('/status', userCanAct('scan'), (req, res) => {
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
