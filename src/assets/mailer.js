const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  }
});

const sendEmail = async (to, subject, body) => {
  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to,
      subject,
      html: body,
      bcc: process.env.ADMIN_EMAIL,
    });

    return true;
  } catch (ex) {
    return ex;
  }
}


module.exports = sendEmail;