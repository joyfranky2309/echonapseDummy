function reminderEmailTemplate({ patientName, message, time }) {
  return `
Hello Caretaker,

This is an alert from EchoNapse.

Patient: ${patientName}
Alert Type: Memory / Assistance Required
Time: ${new Date(time).toLocaleString()}

Message:
${message}

Please check on the patient as soon as possible.

— EchoNapse Healthcare Assistant
`;
}

module.exports = { reminderEmailTemplate };
