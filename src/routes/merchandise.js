const router = require('express').Router();

const { order, getAll, addItem, userCart } = require('../queries/merchandise');
const { success, error } = require('../assets/responses');
const { isUserPermittedTo, selfUserAndGroup } = require('../middlewares/user');

// Showing all the available merchandise
router.get('/', (req, res) => {
  getAll()
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)));
});

// Ordering merchandise route.
router.post('/', (req, res) => {
  const { items } = req.body;

  if (!items)
    return res.status(400).json(error("You have an empty cart which isn't considered as an order."))

  order(req.user.id, items)
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)));
});

// For adding new item in the merchandise route.
router.post('/add', (req, res) => {
  const { name, code, photo, price, description } = req.body;

  if (!name || !code || !price || !photo || !description)
    return res.status(400).json(error("You are missing some property of the item (name, price, code, photo or description)."));

  addItem({ name, price, code, photo, description }, req.user.id)
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)));
});

// For retrieving the cart for the logged-in user or through finance function
router.param('id', selfUserAndGroup('finance', 'function'));
router.get('/cart/:id', (req, res) => {
  userCart(req.params.id)
    .then(result => res.status(200).json(success(result)))
    .catch(err => res.status(403).json(error(err)));
});

module.exports = router;
