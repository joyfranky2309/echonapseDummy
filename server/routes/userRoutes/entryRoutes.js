const express = require('express');
const {getReport}=require("../../services/reportServices")
const {executeAgentCommands} = require("../../services/cmdDispatch")
const {callBehaviorAgent}=require("../../services/agentClient")
const router = express.Router();

const Entry = require('../../schemas/entrySchema');

// CREATE - Add a new entry
router.post('/users/:userId/entries', async (req, res) => {
  try {
    const { userId } = req.params;
    const {content,mood, date} = req.body;

    // Validate required fields
    if (!content || !date) {
      return res.status(400).json({ message: 'Content and date are required' });
    }

    const newEntry = new Entry({
      userId,
      content,
      mood,
      date: new Date(date),
    });

    await newEntry.save();
    const payload={
      userContext: {
      user_id: userId,
      mood: mood || "neutral"
    },
    entryText: content,
    history: await getReport(userId).content,
    }
    const agentop = await callBehaviorAgent(payload);
    console.log("RAW AGENT RESPONSE ↓↓↓");
console.dir(agentop, { depth: null });
    const taskstatus=await executeAgentCommands(agentop.actions,userId);
    console.log("TASK STATUS ↓↓↓");
    console.dir(taskstatus, { depth: null });
    res.status(201).json({ message: 'Entry created successfully', entry: newEntry ,taskstatus});
  } catch (error) {
    res.status(500).json({ message: 'Error creating entry', error: error.message });
  }
});

// READ - Get all entries for a specific user
router.get('/users/:userId/entries', async (req, res) => {
  try {
    const { userId } = req.params;
    const { sortBy = 'date' } = req.query; // sortBy can be 'date', 'createdAt'
    const entries = await Entry.find({ userId }).sort({ [sortBy]: -1 });
    res.status(200).json({ message: 'Entries retrieved successfully', entries });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entries', error: error.message });
  }
});

// READ - Get entries for a user within a date range
router.get('/users/:userId/entries/range', async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const entries = await Entry.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    }).sort({ date: -1 });

    res.status(200).json({ message: 'Entries retrieved successfully', entries });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entries', error: error.message });
  }
});

// READ - Get a single entry by ID
router.get('/entries/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;

    const entry = await Entry.findById(entryId).populate('userId', 'fullName email');
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry retrieved successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entry', error: error.message });
  }
});

// UPDATE - Update an entry by ID
router.put('/entries/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;
    const { content, date} = req.body;

    const entry = await Entry.findById(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    // Update fields if provided
    if (content) entry.content = content;
    if (date) entry.date = new Date(date);
    

    entry.updatedAt = Date.now();
    await entry.save();

    res.status(200).json({ message: 'Entry updated successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Error updating entry', error: error.message });
  }
});

// DELETE - Delete an entry by ID
router.delete('/entries/:entryId', async (req, res) => {
  try {
    const { entryId } = req.params;

    const entry = await Entry.findByIdAndDelete(entryId);
    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.status(200).json({ message: 'Entry deleted successfully', entry });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting entry', error: error.message });
  }
});

// SEARCH - Get entries by tag
router.get('/users/:userId/entries/tag/:tag', async (req, res) => {
  try {
    const { userId, tag } = req.params;

    const entries = await Entry.find({
      userId,
      tags: tag,
    }).sort({ date: -1 });

    res.status(200).json({ message: 'Entries retrieved successfully', entries });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving entries', error: error.message });
  }
});

module.exports = router;
