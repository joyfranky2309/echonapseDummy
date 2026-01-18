const axios = require("axios");

const AGENT_BASE_URL = "http://localhost:8000/api";

const callBehaviorAgent = async (payload) => {
  const res = await axios.post(`${AGENT_BASE_URL}/behavior`, payload);
  return res.data.data;
};

const callReportAgent = async (payload) => {
  const res = await axios.post(`${AGENT_BASE_URL}/report`, payload);
  return res.data.data;
};

module.exports = {
  callBehaviorAgent,
  callReportAgent
};
