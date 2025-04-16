const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.1.2",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Flirty girlfriend AI using Gemini API",
  commandCategory: "AI-Girlfriend",
  usages: "",
  cooldowns: 1
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat";

module.exports.run = async function () {
  // slash command empty
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // "Angel" se message start ho ya "Angel:" wale message ka slide reply ho
  const isAngelStart = body?.toLowerCase().startsWith("angel");
  const isReplyToAngel = messageReply?.body?.toLowerCase().startsWith("angel:");

  if (!isAngelStart && !isReplyToAngel) return;

  const userMessage = isReplyToAngel ? body : body.slice(5).trim();

  if (!userMessage) {
    return api.sendMessage("Bolo baby kya puchhna hai? Sharam aa rahi hai kya?", threadID, messageID);
  }

  if (!chatHistories[senderID]) chatHistories[senderID] = [];
  chatHistories[senderID].push(`User: ${userMessage}`);
  if (chatHistories[senderID].length > 5) chatHistories[senderID].shift();

  const fullConversation = chatHistories[senderID].join("\n");

  const gfPrompt = `Tumhara naam Angel hai. Tum ek girlfriend ki tarah flirty, naughty aur pyaari ho. Tumhare creator ka naam Rudra hai. Har reply chhoti, sweet aur romantic honi chahiye. Agar koi tumhe bot bole to uski funny insult karo. Max 1 line reply karo. Ab baat karo:\n${fullConversation}`;

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
    const botReply = res.data.reply?.trim() || "Samajh nahi aaya baby!";
    chatHistories[senderID].push(`Angel: ${botReply}`);
    return api.sendMessage(`Angel: ${botReply}\n\n– Rudra AI`, threadID, messageID);
  } catch (e) {
    console.log("Angel Error:", e);
    return api.sendMessage("Oops! Angel thoda busy ho gayi baby… baad mein baat karte hain! – Rudra AI", threadID, messageID);
  }
};
