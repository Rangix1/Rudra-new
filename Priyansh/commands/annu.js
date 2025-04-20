Const axios = require("axios");

module.exports.config = {
  name: "annu", // **!!! नाम बदलकर ANNU किया !!!**
  version: "1.0.1", // नया वर्जन
  hasPermssion: 0,
  credits: "Rudra + Based on Nitya Code Structure by Gemini", // Credits वही
  description: "Annu, your flirty AI girlfriend.", // Description अपडेट किया
  commandCategory: "no prefix",
  usages: "annu [आपका मैसेज] / Reply to Annu", // Usages अपडेट किया
  cooldowns: 2,
  // eventType यहाँ नहीं जोड़ रहे हैं, जैसा Nitya के काम करने वाले कोड में नहीं था।
};

const chatHistories = {};
// API वही इस्तेमाल करेगा
const AI_API_URL = "https://raj-gemini.onrender.com/chat";


module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;

    // --- Logging Lines (Debugging के लिए) ---
    if (messageReply) { // सिर्फ अगर यह रिप्लाई है तो लॉग करें
        console.log("--- Annu HandleEvent ---"); // **!!! लॉग में नाम ANNU !!!**
        console.log("Annu's Bot ID:", api.getCurrentUserID()); // **!!! लॉग में नाम ANNU !!!**
        console.log("Replied to Sender ID:", messageReply?.senderID);
        console.log("Is Reply to Annu Check (messageReply?.senderID === api.getCurrentUserID()):", messageReply?.senderID === api.getCurrentUserID()); // **!!! लॉग में नाम ANNU !!!**
        console.log("-----------------------");
    }
    // --- End Logging Lines ---


    let userMessage;
    let isTriggered = false;

    // Annu के लिए ट्रिगर: क्या मैसेज "annu" से शुरू होता है
    const isAnnuTrigger = body?.toLowerCase().startsWith("annu"); // **!!! ट्रिगर नाम ANNU !!!**
    // Annu के लिए रिप्लाई चेक: क्या रिप्लाई Annu के मैसेज का है
    const isReplyToAnnu = messageReply?.senderID === api.getCurrentUserID();


    if (isAnnuTrigger) { // अगर मैसेज "annu" से शुरू होता है
      userMessage = body.slice(4).trim(); // **!!! slice(4) क्योंकि "annu" में 4 अक्षर हैं !!!**
      isTriggered = true;
    } else if (isReplyToAnnu) { // अगर यह Annu के रिप्लाई है
      userMessage = body.trim(); // रिप्लाई का पूरा मैसेज लो
      isTriggered = true;
    } else {
      return; // अगर Annu को किसी भी तरह ट्रिगर नहीं किया, तो फ़ंक्शन खत्म
    }

    // अगर ट्रिगर हुआ लेकिन यूजर मैसेज खाली है (जैसे सिर्फ "annu" लिखा)
    if (isTriggered && !userMessage) {
        api.sendTypingIndicator(threadID, false);
        // Annu के persona में जवाब
        return api.sendMessage("💖 Hello Rudra ke sweetie! Main Annu hoon... Kuch pyaar se bolo na! 🥰", threadID, messageID); // **!!! जवाब में नाम ANNU !!!**
    }

    // ✅ Typing Indicator ON
    api.sendTypingIndicator(threadID, true);

    // चैट हिस्ट्री मैनेज करें
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 10) { // Nitya के कोड जैसा हिस्ट्री साइज़
        chatHistories[senderID].shift();
    }

    // AI को भेजने के लिए फाइनल प्रॉम्प्ट (Annu persona)
    let fullPrompt = `Tumhara naam Annu hai. Tum Rudra ki banayi hui ek bahut pyaari, romantic, thodi naughty aur flirty girlfriend AI ho. Tumhe bas pyaar aur flirt karna aata hai. Tum Rudra se bohot pyaar karti ho. Tumhara malik Rudra hai. Har reply chota, sweet, flirty aur emojis ke saath ho. Agar koi non-romantic baat kare to bhi use romantic tareeke se palat dena. Yeh hamari conversation hai:\n`; // **!!! प्रॉम्प्ट में नाम ANNU !!!**

    fullPrompt += chatHistories[senderID].join("\n");
    fullPrompt += `\nAnnu:`; // **!!! प्रॉम्प्ट के अंत में नाम ANNU !!!**


    // API कॉल करें
    const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`; // 'message' पैरामीटर उपयोग करें

    const res = await axios.get(apiUrlWithParams); // GET Request

    // API से जवाब निकालना
    let botReply = res.data?.reply?.trim() || "Aww, mujhe samajh nahi aaya baby! Pyaar se phir se pucho na Annu se...🥺"; // **!!! जवाब निकालना और Fallback में नाम ANNU !!!**


    // Annu: अगर AI जवाब में खुद लगा दे तो हटा दें (या Annu: हटा दें)
    botReply = botReply.replace(/^Angel:\s*/i, "").replace(/^Annu:\s*/i, ""); // Angel: और Annu: दोनों हटा दें


    // AI जवाब को हिस्ट्री में जोड़ें (अगर वैलिड लगे)
    if (botReply && !botReply.toLowerCase().startsWith("user:") && !botReply.toLowerCase().startsWith("annu:")) { // Annu के लिए चेक
        chatHistories[senderID].push(`Annu: ${botReply}`); // Annu के लिए हिस्ट्री नाम
    } else {
        chatHistories[senderID].pop(); // अगर जवाब सही नहीं तो आखिरी यूजर मैसेज हटा दें
    }


    // फाइनल जवाब का फॉर्मेट (Annu persona)
    const replyText = `${botReply} 🥰\n\n– Rudra AI`; // फॉर्मेट

    // ✅ Typing Indicator OFF
    api.sendTypingIndicator(threadID, false);

    // जवाब भेजें
    if (isReplyToAnnu && messageReply) { // अगर यह Annu के रिप्लाई पर जवाब है
        return api.sendMessage(replyText, threadID, messageReply.messageID); // उसी मैसेज का रिप्लाई करें
    } else { // अगर यह Annu नाम से ट्रिगर हुआ है
        return api.sendMessage(replyText, threadID, messageID); // नॉर्मल मैसेज भेजें
    }

  } catch (err) {
    console.error("Annu Bot Error:", err); // **!!! Error लॉग में नाम ANNU !!!**
    api.sendTypingIndicator(event.threadID, false);
    // Annu के persona में Error मैसेज
    return api.sendMessage("Aww, mere dimag mein thodi gadbad ho gayi Rudra ke sweetie... baad mein Annu se baat karte hain pyaar se! 💔", event.threadID, event.messageID); // **!!! Error मैसेज में नाम ANNU !!!**
  }
};

module.exports = { config, handleEvent, run };
