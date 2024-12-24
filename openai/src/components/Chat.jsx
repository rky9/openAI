import React, { useState } from "react";
import axios from "axios";

const ChatApp = () => {
  const [message, setMessage] = useState(""); // Input message
  const [reply, setReply] = useState("");     // AI's reply
  const [error, setError] = useState("");     // Error message
  const [loading, setLoading] = useState(false); // Loading state

  // Function to call API
  const sendMessage = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setLoading(true); // Start loading
    setError("");     // Clear previous errors
    setReply("");     // Clear previous reply

    try {
      const response = await axios.post("http://localhost:5000/chat", {
        message: message, // Message to send
      });

      setReply(response.data.reply); // Set AI's reply
    } catch (err) {
      console.error(err);

      // Handle errors
      if (err.response) {
        setError(err.response.data.error || "Server error occurred.");
      } else if (err.request) {
        setError("No response from server. Please try again.");
      } else {
        setError("Request failed. Please try again.");
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h2>Chat with AI</h2>
      <textarea
        rows="4"
        cols="50"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message here..."
        style={{ padding: "10px", marginBottom: "10px" }}
      />
      <br />
      <button
        onClick={sendMessage}
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        {loading ? "Sending..." : "Send"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          Error: {error}
        </p>
      )}
      {reply && (
        <div style={{ marginTop: "20px", padding: "10px", background: "#f1f1f1" }}>
          <strong>AI:</strong> {reply}
        </div>
      )}
    </div>
  );
};

export default ChatApp;
