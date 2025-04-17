const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.2.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Flirty girlfriend AI using Gemini API",
  commandCategory: "AI-Girlfriend",
  usages: "",
  cooldowns: 1,
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat";

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  const isAngelStart = body?.toLowerCase().startsWith("angel");
  const isReplyToAngel =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.toLowerCase().startsWith("angel:");

  console.log("Angel Check:");
  console.log("isAngelStart:", isAngelStart);
  console.log("isReplyToAngel:", isReplyToAngel);

  if (!isAngelStart && !isReplyToAngel) return;

  const userMessage = isReplyToAngel ? body : body.slice(5).trim();
  if (!userMessage) {
    return api.sendMessage("Bolo baby kya puchhna hai?", threadID, messageID);
  }

  if (!chatHistories[senderID]) chatHistories[senderID] = [];
  chatHistories[senderID].push(`User: ${userMessage}`);
  if (chatHistories[senderID].length > 5) chatHistories[senderID].shift();

  const fullConversation = chatHistories[senderID].join("\n");
  console.log("Full Conversation:\n", fullConversation);

  const prompt = `Tumhara naam Angel hai. Tum ek pyaari, naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply chhoti, flirty aur romantic honi chahiye. Max 1 line. Karo reply:\n${fullConversation}`;

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
    const botReply = res.data.reply?.trim() || "Samajh nahi aaya baby!";
    console.log("Gemini API Reply:", botReply);

    chatHistories[senderID].push(`Angel: ${botReply}`);
    return api.sendMessage(`Angel: ${botReply}\n\n– Rudra AI`, threadID, messageID);
  } catch (err) {
    console.error("Angel API Error:", err.message);
    return api.sendMessage("Angel thodi busy hai baby, thodi der baad try karo.", threadID, messageID);
  }
};
