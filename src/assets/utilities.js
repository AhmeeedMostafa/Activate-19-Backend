const sortObject = (obj) => (
  Object.keys(obj).sort((a, b) => (new Date(`2019 ${a}`) - new Date(`2019 ${b}`)))
    .reduce((result, key) => {
      result[key] = obj[key];
      return result;
    }, {})
);

const daysNumbering = (day) => {
  switch (day) {
    case 'Thursday':
      return `1. ${day}`;
    case 'Friday':
      return `2. ${day}`;
    case 'Saturday':
      return `3. ${day}`;
    default:
      return day;
  }
}

const checkUserRolePartially = (userRole, neededRole, rolePart) => {
  // EX: oc-teamster-de
  // Type => oc
  // position => teamster
  // function => de
  let partNo = 0;
  switch (rolePart) {
    case 'type':
      partNo = 0;
      break;
    case 'position':
      partNo = 1;
      break;
    case 'function':
      partNo = 2;
      break;
    default:
      partNo = 0;
      break;
  }

  if (!userRole)
    return false;

  const checkingPart = userRole.split('-')[partNo];
  const allowedForAll = ['im', 'all'];

  return checkingPart && (checkingPart.toLowerCase() == neededRole.toLowerCase() || allowedForAll.includes(checkingPart.toLowerCase()));
}

module.exports = { sortObject, daysNumbering, checkUserRolePartially }
