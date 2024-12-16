const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact"); // Ensure correct model path

// GET: Fetch all inbox messages
router.get("/inbox", async (req, res) => {
  try {
    const messages = await Contact.find();
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch inbox messages." });
  }
});

module.exports = router;
router.post("/submit", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validate the input
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }

    // Create a new contact message
    const newMessage = new Contact({ name, email, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Message submitted successfully." });
  } catch (err) {
    console.error("Error submitting contact message:", err.message);
    res.status(500).json({ success: false, error: "Failed to submit message." });
  }
});
