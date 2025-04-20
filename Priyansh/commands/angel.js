Const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.2.3", // Version अपडेट किया (eventType के लिए)
  hasPermssion: 0,
  credits: "Rudra + Modified by ChatGPT + EventType Added by Gemini", // Credits अपडेट किया
  description: "Flirty girlfriend AI using Gemini API. Replies when addressed by name or replied to.",
  commandCategory: "AI-Girlfriend",
  usages: "angel [आपका मैसेज] / Reply to Angel",
  cooldowns: 1,
  eventType: ["message", "message_reply", "message_unsend"], // **!!! यहाँ eventType जोड़ा गया है !!!**
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat"; // Angel जिस API का उपयोग करता है

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;

    // --- Logging Lines (Reply Messages के लिए) ---
    if (event.type === "message_reply") { // रिप्लाई इवेंट के लिए लॉग करें
        console.log("--- Angel HandleEvent (Reply) ---");
        console.log("Angel's Bot ID:", api.getCurrentUserID());
        console.log("Replied to Sender ID:", messageReply?.senderID); // Safe access
        console.log("Is Reply to Angel Check (messageReply?.senderID === api.getCurrentUserID()):", messageReply?.senderID === api.getCurrentUserID()); // Safe access
        console.log("-----------------------");
    }
    // --- End Reply Logging Lines ---

    // --- Logging Lines (Non-Reply Messages के लिए) ---
    if (event.type === "message" && body) { // सामान्य मैसेज इवेंट के लिए लॉग करें
        console.log("--- Angel HandleEvent (Non-Reply) ---");
        console.log("Raw Message Body:", body); // मैसेज का असली टेक्स्ट देखें
        console.log("Message Body (toLowerCase):", body.toLowerCase());
        const isAngelTriggerCheck = body.toLowerCase().startsWith("angel"); // चेक का रिजल्ट लॉग करें
        console.log("isAngelTrigger check (startsWith('angel')):", isAngelTriggerCheck);
        console.log("-----------------------");
    }
    // --- End Non-Reply Logging Lines ---


    // सिर्फ 'message' या 'message_reply' इवेंट पर आगे बढ़ें
    if (event.type !== "message" && event.type !== "message_reply") return;


    let userMessage;
    let isReply = false;
    let isTriggered = false; // Flag to check if any trigger was met

    const isAngelTrigger = body?.toLowerCase().startsWith("angel"); // ट्रिगर चेक: क्या मैसेज "angel" से शुरू होता है
    const isSlideReply = event.type === "message_reply" && messageReply?.senderID === api.getCurrentUserID(); // ट्रिガー चेक: क्या यह Angel के मैसेज का रिप्लाई है और इवेंट टाइप reply है

    if (isAngelTrigger) { // अगर मैसेज "angel" से शुरू होता है
      // --- Logging Line (isAngelTrigger TRUE होने पर) ---
      console.log("--- Angel HandleEvent: isAngelTrigger TRUE, processing... ---");
      // --- End Logging Line ---
      userMessage = body.slice(5).trim(); // Angel के बाद का मैसेज लो
      isTriggered = true;

    } else if (isSlideReply) { // अगर यह Angel के मैसेज का रिप्लाई है
      userMessage = body.trim(); // रिप्लाई का पूरा मैसेज लो
      isReply = true;
      isTriggered = true;

    } else {
      return; // अगर Angel को किसी भी तरह ट्रिगर नहीं किया गया, तो यहाँ से फ़ंक्शन खत्म
    }

    // अगर ट्रिगर हुआ लेकिन यूजर मैसेज खाली है (जैसे सिर्फ "angel" लिखा)
    if (isTriggered && !userMessage) { // isTriggered चेक ऐड किया
        api.sendTypingIndicator(threadID, false);
        return api.sendMessage("Baby, kuch toh bolo na! 💋", threadID, messageID); // Angel के persona में जवाब
    }

    // ✅ Typing Indicator ON
    api.sendTypingIndicator(threadID, true);

    // चैट हिस्ट्री मैनेज करें
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 6) chatHistories[senderID].shift(); // हिस्ट्री साइज़ 6 (Angel के original code जैसा)

    // AI को भेजने के लिए फाइनल प्रॉम्प्ट (Angel persona)
    const convo = chatHistories[senderID].join("\n");
    const finalPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply short aur sweet ho. Bot bole toh thoda mazaak udaana. 1 line me jawab do (emojis ke saath):\n${convo}`;

    // AI API कॉल करें (वही API जो Angel उपयोग कर रहा है)
    const apiUrlWithParams = `${API_URL}?message=${encodeURIComponent(fullPrompt)}`; // fullPrompt का उपयोग करें
    const res = await axios.get(apiUrlWithParams);
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
    if (isReply && messageReply) { // अगर यह रिप्लाई था
      return api.sendMessage(replyText, threadID, messageReply.messageID); // उसी मैसेज का रिप्लाई करें
    } else { // अगर यह angel trigger था
      return api.sendMessage(replyText, threadID, messageID); // नॉर्मल मैसेज भेजें
    }

  } catch (err) {
    console.error("Angel Bot Error:", err);
    api.sendTypingIndicator(event.threadID, false);
    return api.sendMessage("Angel thodi busy hai baby… baad mein milti hoon! 🥺 – Rudra AI", event.threadID, event.messageID);
  }
};

module.exports = { config, handleEvent, run };
