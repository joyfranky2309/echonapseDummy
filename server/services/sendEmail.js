const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

async function sendCaretakerEmail({ to, subject, text }) {
  return await transporter.sendMail({
    from: `"EchoNapse Alerts" <${process.env.ALERT_EMAIL}>`,
    to,
    subject,
    text
  });
}

module.exports = { sendCaretakerEmail };
