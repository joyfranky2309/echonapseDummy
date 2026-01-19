require("dotenv").config();

const { sendCaretakerEmail } = require("./services/emailService");
const { reminderEmailTemplate } = require("./utils/emailTemplates");

async function testEmail() {
  try {
    await sendCaretakerEmail({
      to: "naniyashwanth618@gmail.com", // 👈 put YOUR email here
      subject: "EchoNapse Test Alert",
      text: reminderEmailTemplate({
        title: "Test Reminder",
        time: new Date()
      })
    });

    console.log("✅ TEST EMAIL SENT SUCCESSFULLY");
  } catch (err) {
    console.error("❌ EMAIL FAILED:", err);
  }
}

testEmail();
