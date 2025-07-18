
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [typingUser, setTypingUser] = useState("");

  useEffect(() => {
    const name = prompt("Enter your name (e.g., Lily 🌸)");
    setUsername(name);
    socket.emit("join", name);

    socket.on("chat_message", (data) => {
      setChat((prev) => [...prev, data]);
    });

    socket.on("typing", (user) => {
      setTypingUser(user);
      setTimeout(() => setTypingUser(""), 2000);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat_message", { user: username, text: message });
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", username);
  };

  return (
    <div className="chat-container">
      <h2>💖 Girly Chat Room 💬</h2>
      <div className="chat-box">
        {chat.map((msg, i) => (
          <div key={i} className={`chat-bubble ${msg.user === username ? "me" : "other"}`}>
            <strong>{msg.user}:</strong> {msg.text}
          </div>
        ))}
        {typingUser && <p className="typing">{typingUser} is typing...</p>}
      </div>
      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type something cute 💕"
        />
        <button onClick={sendMessage}>Send 💌</button>
      </div>
    </div>
  );
}

export default App;
