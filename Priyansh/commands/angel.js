const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.1.4", // Updated version
  hasPermssion: 0,
  credits: "Rudra",
  description: "Flirty girlfriend AI using Gemini API. Replies even when you slide reply to its messages.",
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

    let userMessage;
    let isReply = false;

    // 1. Angel word se trigger ya slide reply se trigger
    const isAngelTrigger = body?.toLowerCase().startsWith("angel");
    const isSlideReply = messageReply?.senderID === api.getCurrentUserID();

    if (isAngelTrigger) {
      userMessage = body.slice(5).trim();
    } else if (isSlideReply) {
      userMessage = body.trim();
      isReply = true;
    } else {
      return;
    }

    if (!userMessage) {
      return api.sendMessage("Baby, kuch toh bolo na!", threadID, messageID);
    }

    // 2. Store conversation
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 6) chatHistories[senderID].shift();

    const convo = chatHistories[senderID].join("\n");
    const finalPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply short aur sweet ho. Bot bole toh thoda mazaak udaana. 1 line me jawab do:\n${convo}`;

    // 3. Gemini API se call
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(finalPrompt)}`);
    const botReply = res.data?.reply?.trim() || "Aww, mujhe samajh nahi aaya baby!";

    // 4. Store reply
    chatHistories[senderID].push(`Angel: ${botReply}`);

    // 5. Send message
    let replyText = `Angel: ${botReply}\n\n– Rudra AI`;
    if (isReply && messageReply) {
      return api.sendMessage(replyText, threadID, messageReply.messageID);
    } else {
      return api.sendMessage(replyText, threadID, messageID);
    }

  } catch (err) {
    console.error("Angel Bot Error:", err);
    return api.sendMessage("Angel thodi busy hai baby… baad mein milti hoon! – Rudra AI", event.threadID, event.messageID);
  }
};
