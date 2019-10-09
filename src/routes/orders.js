const router = require('express').Router();
const { success, error } = require('../assets/responses');
const { checkUserRolePartially } = require('../assets/utilities');
const { getAll } = require('../queries/orders');

router.get('/:email', (req, res) => {
    let { email } = req.params;

    if (!checkUserRolePartially('oc', 'type'))
        email = req.user.email;

    return getAll(page, 100, email || '')
        .then((delegates) => res.status(200).json(success(delegates)))
        .catch((err) => res.status(403).json(error(`Error: ${err}.`)));
});

module.exports = router;