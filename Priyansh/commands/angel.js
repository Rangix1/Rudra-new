const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.2.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Flirty AI girlfriend using Gemini API",
  commandCategory: "AI-Girlfriend",
  usages: "Just say 'Angel' or reply to Angel's message",
  cooldowns: 1,
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat";

module.exports.run = async function () {
  // Empty, because command prefix nahi chahiye
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Angel se direct baat karna
  const isAngelStart = body?.toLowerCase().startsWith("angel");

  // Agar kisi ne Angel ke message ko slide/reply kiya
  const isReplyToAngel =
    messageReply &&
    messageReply.senderID === api.getCurrentUserID() &&
    messageReply.body?.toLowerCase().startsWith("angel:");

  if (!isAngelStart && !isReplyToAngel) return;

  const userMessage = isReplyToAngel ? body : body.slice(5).trim();

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

  const prompt = `Tumhara naam Angel hai. Tum ek pyaari, naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply chhoti, flirty aur romantic honi chahiye. Max 1 line. Karo reply:\n${fullConversation}`;

  try {
    const res = await axios.get(
      `${API_URL}?message=${encodeURIComponent(prompt)}`
    );
    const botReply = res.data.reply?.trim() || "Samajh nahi aaya baby!";

    chatHistories[senderID].push(`Angel: ${botReply}`);
    return api.sendMessage(`Angel: ${botReply}\n\n– Rudra AI`, threadID, messageID);
  } catch (err) {
    console.error("Angel Error:", err);
    return api.sendMessage(
      "Oops! Angel busy ho gayi baby… thodi der mein try karo – Rudra AI",
      threadID,
      messageID
    );
  }
};
