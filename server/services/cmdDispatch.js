const { createCalendarEvent } = require("../services/createEvent");

async function executeAgentCommands(commands, userId) {
  const results = [];

  for (const cmd of commands) {
    switch (cmd.action) {
      case "SET_REMINDER":
        results.push(
          await createCalendarEvent(cmd.payload)
        );
        break;

      default:
        results.push({ skipped: cmd.action });
    }
  }

  return results;
}
module.exports = { executeAgentCommands };