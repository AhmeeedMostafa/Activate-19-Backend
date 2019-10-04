const jwt = require('jsonwebtoken');
const { checkUserRolePartially } = require('../assets/utilities');
const { error } = require('../assets/responses');

// Verifying user token (JWT) & decoding the data from the token to get the current user info.
const verifyUser = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).json(error('Unauthorized user, you are not allowed to do this operation please login.'))

  token = token.split(' ')[1];
  jwt.verify(token, process.env.SECRET_KEY, (err, decodedData) => {
    if (err)
      return res.status(401).json(error('Invalid login token, please login again.'))

    req.user = decodedData.user;
    next();
  });
}

// Check if the user has the role to continue in the specfic request
const userHasRole = (roles) => (
  (req, res, next) => {
    const userRole = req.user.role;
    if (userRole && roles.some(role))
      next();
    else
      return res.status(401).json(error('Oops, You are not allowed to do this operation.'))
  }
);

// Check if the user has the permission to do a specfic action,
// (action name should be equal to the saved in db. in permissions object)
const isUserPermittedTo = (action) => (
  (req, res, next) => {
    const userPermissions = req.user.permissions;
    return (userPermissions
      && (userPermissions[`can_${action}`] || false))
      ? next()
      : res.status(401).json(error('Oops, You are not allowed to do this operation.'))
  }
);

// Check if this request is allowed for the current user whether by checking if the request is about his acc. or from a specfic accepted group.
const selfUserAndGroup = (group, groupBy) => (
  (req, res, next, userId) => (
    (userId && (req.user.id === userId || checkUserRolePartially(req.user.role, group, groupBy)))
      ? next()
      : res.status(401).json(error('Oops, You are not allowed to do this operation.'))
  )
);

// oc-teamster-se, groupBy vals => { type, position, function }
// @PARAM groupBy: whether the checking will be a general like if he is OC/Delegate or checking as a function like DE/SE
// or as a position like VP/teamster/P/coach
const groupOfUsers = (group, groupBy) => (
  (req, res, next) => {
    return checkUserRolePartially(req.user.role, group, groupBy)
      ? next()
      : res.status(401).json(error('Oops, You are not allowed to do this operation.'))
  }
);

module.exports = { userHasRole, isUserPermittedTo, verifyUser, groupOfUsers, selfUserAndGroup }
