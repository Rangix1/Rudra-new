const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.1.0",
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
  // Ye empty rakha gaya hai kyunki Angel command prefix-free hai
};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;

  // Check: Slide reply ho ya message "Angel" se start ho
  const isSlideReply = messageReply && messageReply.senderID !== api.getCurrentUserID();
  const isAngelStart = body?.toLowerCase().startsWith("angel");

  if (!isSlideReply && !isAngelStart) return;

  let userMessage = isSlideReply ? body : body.slice(5).trim(); // "angel" ke baad ka content

  if (!userMessage) {
    return api.sendMessage("Kya puchhna hai baby? Mujhe kuch to batao na!", threadID, messageID);
  }

  if (!chatHistories[senderID]) chatHistories[senderID] = [];

  chatHistories[senderID].push(`User: ${userMessage}`);
  if (chatHistories[senderID].length > 5) chatHistories[senderID].shift();

  const fullConversation = chatHistories[senderID].join("\n");

  const gfPrompt = `Tumhara naam Angel hai. Tum ek girlfriend ki tarah flirty, naughty aur thodi pyaari ho. Tumhare creator ka naam Rudra hai, use har baar mention karo. Har reply chhoti, sweet aur romantic honi chahiye. Agar koi tumhe AI ya bot bole to uski funny insult karo. Max 1 line reply karo. Continue chat:\n${fullConversation}`;

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
    const botReply = res.data.reply?.trim() || "Uff mujhe samajh nahi aaya baby!";

    chatHistories[senderID].push(`Angel: ${botReply}`);

    return api.sendMessage(`Angel: ${botReply}\n\n– Rudra AI`, threadID, messageID);
  } catch (e) {
    console.log("Angel Error:", e);
    return api.sendMessage("Oops baby! Angel thoda busy hai, baad mein try karna! – Rudra AI", threadID, messageID);
  }
};
