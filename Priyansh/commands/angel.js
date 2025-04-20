Const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.2.1", // Version अपडेट किया (Logging के लिए)
  hasPermssion: 0,
  credits: "Rudra + Modified by ChatGPT + Logging by Gemini", // Credits अपडेट किया
  description: "Flirty girlfriend AI using Gemini API. Replies even when you slide reply to its messages.",
  commandCategory: "AI-Girlfriend",
  usages: "",
  cooldowns: 1,
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat"; // Angel जिस API का उपयोग करता है

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;

    // --- Logging Lines (Added for Debugging) ---
    if (messageReply) { // सिर्फ अगर यह रिप्लाई है तो लॉग करें
        console.log("--- Angel HandleEvent ---");
        console.log("Angel's Bot ID:", api.getCurrentUserID());
        console.log("Replied to Sender ID:", messageReply.senderID);
        console.log("Is Reply to Angel Check (messageReply.senderID === api.getCurrentUserID()):", messageReply.senderID === api.getCurrentUserID());
        console.log("-----------------------");
    }
    // --- End Logging Lines ---

    let userMessage;
    let isReply = false;

    const isAngelTrigger = body?.toLowerCase().startsWith("angel");
    const isSlideReply = messageReply?.senderID === api.getCurrentUserID(); // यह लाइन चेक कर रही है कि रिप्लाई Angel का है या नहीं

    if (isAngelTrigger) {
      userMessage = body.slice(5).trim();
    } else if (isSlideReply) { // लॉजिक सिर्फ तभी आगे बढ़ता है जब रिप्लाई Angel का हो
      userMessage = body.trim();
      isReply = true;
    } else {
      return; // अगर Angel को ट्रिगर नहीं किया गया, तो कुछ नहीं करना
    }

    // अगर ट्रिगर हुआ लेकिन यूजर मैसेज खाली है
    if (!userMessage) {
      api.sendTypingIndicator(threadID, false); // Typing बंद करें
      return api.sendMessage("Baby, kuch toh bolo na! 💋", threadID, messageID); // मैसेज Angel के persona में
    }

    // ✅ Typing Indicator ON
    api.sendTypingIndicator(threadID, true);

    // चैट हिस्ट्री मैनेज करें
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 6) chatHistories[senderID].shift(); // हिस्ट्री साइज़ 6

    // AI को भेजने के लिए फाइनल प्रॉम्प्ट (Angel persona)
    const convo = chatHistories[senderID].join("\n");
    const finalPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply short aur sweet ho. Bot bole toh thoda mazaak udaana. 1 line me jawab do (emojis ke saath):\n${convo}`;

    // AI API कॉल करें (वही API जो Angel उपयोग कर रहा है)
    const res = await axios.get(`${API_URL}?message=${encodeURIComponent(finalPrompt)}`);
    let botReply = res.data?.reply?.trim() || "Aww, mujhe samajh nahi aaya baby!"; // जवाब निकालना

    // Angel: अगर AI जवाब में खुद लगा दे तो हटा दें
    botReply = botReply.replace(/^Angel:\s*/i, "");

    // AI जवाब को हिस्ट्री में जोड़ें
    chatHistories[senderID].push(`Angel: ${botReply}`);

    // फाइनल जवाब का फॉर्मेट
    const replyText = `Angel: ${botReply} 💞\n\n– Rudra AI`; // Angel persona में

    // ✅ Typing Indicator OFF
    api.sendTypingIndicator(threadID, false);

    // जवाब भेजें
    // यह हिस्सा भी सिर्फ तभी चलेगा जब ऊपर trigger conditions में से कोई एक सही हुई हो
    if (isReply && messageReply) { // अगर यह रिप्लाई था (और ऊपर isSlideReply चेक पास हुआ था)
      return api.sendMessage(replyText, threadID, messageReply.messageID); // उसी मैसेज का रिप्लाई करें
    } else {
      return api.sendMessage(replyText, threadID, messageID); // नॉर्मल मैसेज भेजें
    }

  } catch (err) {
    console.error("Angel Bot Error:", err);
    api.sendTypingIndicator(event.threadID, false); // Error पर Typing बंद करें
    // Error मैसेज Angel persona में
    return api.sendMessage("Angel thodi busy hai baby… baad mein milti hoon! 🥺 – Rudra AI", event.threadID, event.messageID);
  }
};

module.exports = { config, handleEvent, run };
