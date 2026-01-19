const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ALERT_EMAIL,
    pass: process.env.ALERT_EMAIL_PASSWORD,
  },
});

async function sendCaretakerEmail({ to, subject, text }) {
  try {
    const info = await transporter.sendMail({
      from: `"EchoNapse Alerts" <${process.env.ALERT_EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("📧 Email sent:", info.response);
    return info;
  } catch (err) {
    console.error("❌ Email send failed:", err.message);
    throw err;
  }
}

module.exports = { sendCaretakerEmail };
