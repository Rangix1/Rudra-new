const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "2.2",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Angel AI - Smart GF with reply context",
  commandCategory: "no-prefix",
  usages: "Touch-reply based romantic AI",
  cooldowns: 2,
};

const API_URL = "https://raj-gemini.onrender.com/chat";
const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, messageID, senderID, body, messageReply } = event;
  if (!body) return;

  let userMessage = body.trim();
  let context = "";

  // Agar user ne kisi message ko reply kiya hai
  if (messageReply && messageReply.body) {
    context = `Usne bola: "${messageReply.body}"\nUser: ${userMessage}`;
  } else if (userMessage.toLowerCase().startsWith("angel")) {
    userMessage = userMessage.replace(/^angel[:,\s]*/i, "");
    context = `User: ${userMessage}`;
  } else {
    return; // agar na reply kiya ho aur na 'angel' se start ho, toh ignore
  }

  if (!chatHistories[senderID]) chatHistories[senderID] = [];
  chatHistories[senderID].push(context);

  if (chatHistories[senderID].length > 5) {
    chatHistories[senderID].shift();
  }

  const fullConversation = chatHistories[senderID].join("\n");

  const prompt = `Tumhara naam Angel hai. Tum ek naughty, romantic girlfriend ho. Har message ka max 1-2 line ka sweet ya flirty jawaab dena. Bot ya AI bola to funny roast dena. Apne aap ko hamesha insaan kehna. Ab baat continue karo:\n\n${fullConversation}`;

  api.setMessageReaction("⏳", messageID, () => {}, true);

  try {
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
    let botReply = res.data.reply || "Aww baby mujhe samajh nahi aaya!";
    botReply += "\n\n– Rudra AI";

    chatHistories[senderID].push(`Angel: ${botReply}`);
    api.sendMessage(botReply, threadID, messageID);
    api.setMessageReaction("❤️", messageID, () => {}, true);
  } catch (err) {
    console.error(err);
    api.sendMessage("Baby mujhe kuch galat feel hua, thodi der baad try karo na...", threadID, messageID);
    api.setMessageReaction("❌", messageID, () => {}, true);
  }
};

module.exports.run = () => {};
