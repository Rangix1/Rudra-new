const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.1.3",
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
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;

    // 1. Angel word se ya slide reply se trigger
    const isAngelTrigger = body?.toLowerCase().startsWith("angel");
    const isSlideReplyToAngel = messageReply &&
      messageReply.senderID === api.getCurrentUserID() &&
      messageReply.body?.toLowerCase().startsWith("angel:");

    if (!isAngelTrigger && !isSlideReplyToAngel) return;

    // 2. User message text
    const userMessage = isSlideReplyToAngel ? body.trim() : body.slice(5).trim();
    if (!userMessage) {
      return api.sendMessage("Baby, kuch toh bolo na!", threadID, messageID);
    }

    // 3. Store conversation
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 6) chatHistories[senderID].shift();

    const convo = chatHistories[senderID].join("\n");
    const finalPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply short aur sweet ho. Bot bole toh thoda mazaak udaana. 1 line me jawab do:\n${convo}`;

    // 4. Gemini API se call
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(finalPrompt)}`);
    const botReply = res.data?.reply?.trim() || "Aww, mujhe samajh nahi aaya baby!";

    // 5. Store reply
    chatHistories[senderID].push(`Angel: ${botReply}`);

    // 6. Send message
    return api.sendMessage(`Angel: ${botReply}\n\n– Rudra AI`, threadID, messageID);

  } catch (err) {
    console.error("Angel Bot Error:", err);
    return api.sendMessage("Angel thodi busy hai baby… baad mein milti hoon! – Rudra AI", event.threadID, event.messageID);
  }
};
