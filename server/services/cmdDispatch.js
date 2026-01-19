const { createCalendarEvent } = require("../services/createEvent");
const {create}= require("../services/reportServices")

async function executeAgentCommands(commands, userId) {
  const results = [];

  for (const cmd of commands) {
    switch (cmd.action) {
      case "SET_REMINDER":
        results.push(
          await createCalendarEvent(cmd.payload)
        );
        break;
      case "STORE_INTERACTION":
        console.log("Report storing", cmd.analysis_result);
        results.push(await create(userId, cmd.analysis_result));
        break;
      default:
        results.push({ skipped: cmd.action });
    }
  }

  return results;
}
module.exports = { executeAgentCommands };