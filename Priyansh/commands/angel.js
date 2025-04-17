const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.1.2",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Flirty girlfriend AI using Gemini API",
  commandCategory: "AI-Girlfriend",
  usages: "",
  cooldowns: 1,
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat";

module.exports.run = async function () {
  // Empty run because we want no prefix usage
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Angel word se trigger ho
  const triggerWord = body?.toLowerCase().startsWith("angel");

  // Slide reply check: agar kisi message ka reply ho aur us msg me "Angel:" ho
  const isSlideReplyToAngel = messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.toLowerCase().startsWith("angel:");

  if (!triggerWord && !isSlideReplyToAngel) return;

  // User message nikaalo (trigger word hata ke ya pura reply)
  const userMessage = isSlideReplyToAngel ? body : body.slice(5).trim();

  if (!userMessage) {
    return api.sendMessage(
      "Bolo baby kya puchhna hai? Sharam aa rahi hai kya?",
      threadID,
      messageID
    );
  }

  // Chat history maintain
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
    return api.sendMessage(
      "Oops! Angel thoda busy ho gayi baby… baad mein baat karte hain! – Rudra AI",
      threadID,
      messageID
    );
  }
};
