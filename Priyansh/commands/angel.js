const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.1.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Flirty girlfriend AI using Gemini API",
  commandCategory: "AI-Girlfriend",
  usages: "",
  cooldowns: 1
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat";

// Empty run method as prefix nahi chahiye
module.exports.run = async function () {
  // Empty as no prefix required
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Condition for starting with "angel" or replying to angel's message
  const isAngelStart = body?.toLowerCase().startsWith("angel");
  const isSlideReplyToAngel = messageReply && messageReply.senderID === api.getCurrentUserID() && 
                              messageReply.body?.toLowerCase().startsWith("angel:");

  // Only proceed if it's "angel" message or a reply to angel
  if (!isAngelStart && !isSlideReplyToAngel) return;

  // Extract user message for conversation
  const userMessage = isSlideReplyToAngel ? body : body.slice(5).trim();

  if (!userMessage) {
    return api.sendMessage("Bolo baby kya puchhna hai? Sharam aa rahi hai kya?", threadID, messageID);
  }

  // Store conversation history
  if (!chatHistories[senderID]) chatHistories[senderID] = [];
  chatHistories[senderID].push(`User: ${userMessage}`);

  // Keep history size under control
  if (chatHistories[senderID].length > 5) chatHistories[senderID].shift();

  const fullConversation = chatHistories[senderID].join("\n");

  // Girlfriend style prompt for Gemini AI
  const gfPrompt = `Tumhara naam Angel hai. Tum ek girlfriend ki tarah flirty, naughty aur pyaari ho. Tumhare creator ka naam Rudra hai. Har reply chhoti, sweet aur romantic honi chahiye. Agar koi tumhe bot bole to uski funny insult karo. Max 1 line reply karo. Ab baat karo:\n${fullConversation}`;

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
    const botReply = res.data.reply?.trim() || "Samajh nahi aaya baby!";

    // Add bot's reply to the history
    chatHistories[senderID].push(`Angel: ${botReply}`);

    // Send reply in the thread
    return api.sendMessage(`Angel: ${botReply}\n\n– Rudra AI`, threadID, messageID);
  } catch (e) {
    console.log("Angel Error:", e);
    return api.sendMessage("Oops! Angel thoda busy ho gayi baby… baad mein baat karte hain! – Rudra AI", threadID, messageID);
  }
};
