const nodemailer = require("nodemailer");
const User = require("../schemas/userSchema");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

async function sendCaretakerEmail(cmd, userId) {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  const caretaker = user.caretakerDetails?.[0];

  if (!caretaker?.emailID) {
    throw new Error("Caretaker email missing");
  }

  return await transporter.sendMail({
    from: `"EchoNapse Alerts" <${process.env.ALERT_EMAIL}>`,
    to: caretaker.emailID,
    subject: cmd.reason,
    text: cmd.payload.message
  });
}

async function sendAlert(cmd, userId) {
  const user = await User.findById(userId);

  if (!user?.email) {
    throw new Error("User email missing");
  }

  return await transporter.sendMail({
    from: `"EchoNapse Alerts" <${process.env.ALERT_EMAIL}>`,
    to: user.email,
    subject: cmd.reason,
    text: cmd.payload.message
  });
}

module.exports = { sendCaretakerEmail, sendAlert };
