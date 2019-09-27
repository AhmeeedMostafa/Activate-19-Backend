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

const sendEmail = async (to, subject, body) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS, }
  });

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME} 👻" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html: body,
      cc: process.env.ADMIN_EMAIL,
    });

    return Promise.resolve(true);
  } catch (ex) {
    return Promise.reject(ex)
  }
}

const checkUserRolePartially = (userRole, needRole, rolePart) => {
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

  const checkingPart = userRole.split('-')[partNo];

  return checkingPart && checkingPart.toLowerCase() == needRole.toLowerCase();
}

module.exports = { sortObject, daysNumbering, sendEmail, checkUserRolePartially }
