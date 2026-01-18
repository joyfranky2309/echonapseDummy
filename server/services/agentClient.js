const axios = require("axios");

const AGENT_BASE_URL = "http://localhost:8000";

/**
 * Analyze a journal entry and get both actions and comprehensive report
 * @param {Object} payload - The analysis request
 * @param {Object} payload.userContext - User context (user_id, mood)
 * @param {string} payload.entryText - The journal entry text
 * @param {string} payload.history - Previous behavioral patterns/reports
 * @returns {Promise<Object>} - { actions: [], report: {} }
 */
const analyzeBehavior = async (payload) => {
  try {
    const res = await axios.post(`${AGENT_BASE_URL}/analyze`, payload);
    return res.data; // Returns { actions: [], report: {} }
  } catch (error) {
    console.error("Error analyzing behavior:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Test the agent with sample data
 * @returns {Promise<Object>} - { actions: [], report: {} }
 */
const testAnalyze = async () => {
  try {
    const res = await axios.post(`${AGENT_BASE_URL}/analyze/test`);
    return res.data;
  } catch (error) {
    console.error("Error in test analyze:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get information about all agents
 * @returns {Promise<Object>} - Agent information
 */
const getAgents = async () => {
  try {
    const res = await axios.get(`${AGENT_BASE_URL}/agents`);
    return res.data;
  } catch (error) {
    console.error("Error getting agents:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Health check
 * @returns {Promise<Object>} - Health status
 */
const healthCheck = async () => {
  try {
    const res = await axios.get(`${AGENT_BASE_URL}/health`);
    return res.data;
  } catch (error) {
    console.error("Error in health check:", error.response?.data || error.message);
    throw error;
  }
};

// Example usage:
const exampleUsage = async () => {
  const payload = {
    userContext: {
      user_id: "user_123",
      mood: "calm"
    },
    entryText: "I have a doctor appointment at 2pm tomorrow. Feeling a bit tired today.",
    history: "User has been logging regularly. No major concerns in past entries."
  };

  try {
    const result = await analyzeBehavior(payload);
    
    // Access actions
    console.log("Actions:", result.actions);
    // Actions will be an array like:
    // [
    //   { action: "SET_REMINDER", reason: "...", confidence: 0.95, payload: {...} },
    //   { action: "STORE_INTERACTION", reason: "...", confidence: 0.8, payload: {...} }
    // ]
    
    // Access comprehensive report
    console.log("Report:", result.report);
    // Report will include:
    // {
    //   report_id: "...",
    //   user_id: "...",
    //   entry_summary: "...",
    //   cognitive_status: "...",
    //   caretaker_notes: "...",
    //   ... all other report fields
    // }
    
    return result;
  } catch (error) {
    console.error("Failed to analyze:", error);
  }
};

module.exports = {
  analyzeBehavior,
  testAnalyze,
  getAgents,
  healthCheck,
  
  // Keep old names for backward compatibility if needed
  callBehaviorAgent: analyzeBehavior,
};