const nodemailer = require("nodemailer");
const User = require("../schemas/userSchema");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD
  }
});

async function sendCaretakerEmail(cmd,userId) {
  const to = await User.find({_id:userId}).caretakerDetails.emailID;
  const subject = cmd.reason;
  const text=cmd.payload.message;
  const evidence=cmd.payload.evidence;

  return await transporter.sendMail({
    from: `"EchoNapse Alerts" <${process.env.ALERT_EMAIL}>`,
    to,
    subject,
    text,
    evidence,
  });
}
async function sendAlert(cmd,userId) {
  const to = await User.find({_id:userId}).email;
  const subject = cmd.reason;
  const text=cmd.payload.message;
  return await transporter.sendMail({
    from: `"EchoNapse Alerts" <${process.env.ALERT_EMAIL}>`,
    to,
    subject,
    text
  });
}
// function reminderEmailTemplate({ patientName, message, time }) {
//   return `
// Hello Caretaker,

// This is an alert from EchoNapse.

// Patient: ${patientName}
// Alert Type: Memory / Assistance Required
// Time: ${new Date(time).toLocaleString()}

// Message:
// ${message}

// Please check on the patient as soon as possible.

// — EchoNapse Healthcare Assistant
// `;
// }


module.exports = { sendCaretakerEmail,sendAlert };
