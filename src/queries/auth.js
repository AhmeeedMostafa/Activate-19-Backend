const jwt = require('jsonwebtoken');
const { findDelegateByEmail } = require('./delegates');
const sendEmail = require('../assets/mailer');

// For logging-in user & generating his token
const logIn = async (email, password) => {
  try {
    const user = await findDelegateByEmail(email);
    if (user.password !== password)
      return Promise.reject('Wrong Password, Please click on forgot my password for retrieving it.');

    const neededUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      function: user.function,
      position: user.position,
      permissions: user.permissions || null,
      lc: user.lc,
      photo: user.photo,
    }

    const token = jwt.sign({ user: neededUserData }, process.env.JWT_SECRET_KEY);

    return { token, user: neededUserData }
  } catch (ex) {
    return Promise.reject(ex)
  }
}

// For retrieving & sending  the password through email in case the user has forgot it
const forgotPassword = async (email) => {
  try {
    const user = await findDelegateByEmail(email);
    const emailBody = `<div style='font-family: Arial; font-size: 16px;'>
          <h4>Dear ${user.name},</h4>
          <p>You have requested to retrieve you Activate'19 email's password.</p>
          <p>Your email's email: <strong><i>${user.email}</i></strong></p>
          <p>Your email's password: <strong><i>${user.password}</i></strong></p>
          <p style='color: grey; font-size: 10px;'>Please ignore this email if you did not request a password change.</p>
        </div>`;

    const send = sendEmail(email, "Your password - Activate'19 by AIESEC in CU 👻", emailBody)
    if (send)
      return Promise.resolve('Password has been sent again to your email')
    else
      return Promise.reject(`Error in sending email: ${send}`);
  } catch (ex) {
    return Promise.reject(ex)
  }
}

module.exports = { logIn, forgotPassword };
