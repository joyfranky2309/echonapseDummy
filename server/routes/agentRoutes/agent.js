const express = require("express");
const { callBehaviorAgent } = require("../../services/agentClient");
// const { dispatchAgentCommands } = require("../../agent/commandDispatcher"); // comment out for now

const router = express.Router();

router.post("/process-entry", async (req, res) => {
  try {
    const { userContext, entryText, history } = req.body;

    const agentResult = await callBehaviorAgent({
      user_context: userContext,
      interaction: entryText,
      conversation_history: history || []
    });

    // Comment out command dispatcher for now
    // const commandResults = await dispatchAgentCommands(agentResult.commands || []);

    console.log("Agent result:", agentResult); // just log it for now

    res.json({
      success: true,
      analysis: agentResult.analysis,
      // executedCommands: commandResults
      executedCommands: [] // placeholder
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Agent processing failed" });
  }
});

module.exports = router;
