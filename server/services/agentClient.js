const axios = require("axios");
const {cmdsystem}=require("./cmdDispatch")
const AGENT_BASE_URL = "http://localhost:8000";

/**
 * Analyze a journal entry and get both actions and comprehensive report
 */
const callBehaviorAgent = async (payload) => {
  try {
    console.log(payload)
    // Transform the payload to match FastAPI expectations
    const requestPayload = {
      userContext: {
        user_id: payload.userContext?.user_id || payload.userId,
        mood: payload.userContext?.mood || payload.mood || "neutral"
      },
      entryText: payload.entryText,
      // If history is an array, join it into a single string
      history: Array.isArray(payload.history) 
        ? payload.history.join("\n") 
        : (payload.history || ""),
      current_datetime: new Date().toISOString()
    };
    console.log(requestPayload)
    console.log("Sending to agent:", JSON.stringify(requestPayload, null, 2));

    const res = await axios.post(`${AGENT_BASE_URL}/analyze`, requestPayload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return res.data; 
  } catch (error) {
    console.error("Error analyzing behavior:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Example: How to call from your backend route
 */
const exampleUsage = async () => {
  // Example 1: If your data comes with history as array
  const dataWithArray = {
    userContext: {
      user_id: "696b49d08b64d163e16dd4cd",
      mood: "neutral"
    },
    entryText: "I need to take my blood test on 22nd January at 10am.",
    history: [
      "User has a routine medication schedule but sometimes forgets appointments."
    ]
  };

  // Example 2: If your data comes with history as string
  const dataWithString = {
    userContext: {
      user_id: "696b49d08b64d163e16dd4cd",
      mood: "neutral"
    },
    entryText: "I need to take my blood test on 22nd January at 10am.",
    history: "User has a routine medication schedule but sometimes forgets appointments."
  };

  // Both will work with the callBehaviorAgent function above
  try {
    const result = await callBehaviorAgent(dataWithArray); // or dataWithString
    console.log("Actions:", result.actions);
    console.log("Report:", result.report);
    return result;
  } catch (error) {
    console.error("Failed:", error);
  }
};

module.exports = {
  callBehaviorAgent
};