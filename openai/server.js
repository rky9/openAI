const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON body

// Initialize OpenAI with API key
const openai = new OpenAI({
    apiKey:"YOUR_API_KEY"});

// POST endpoint for chat
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body; // Extract message from request body

    // Validate request body
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Invalid message format" });
    }

    // Call OpenAI API
    const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo", // Use this if gpt-4 is not available
        messages: [{ role: "user", content: message }],
        max_tokens: 100,
      });

    // Send AI response back to client
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error.message);

    // Handle specific OpenAI API errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: error.response.data.error.message,
      });
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
