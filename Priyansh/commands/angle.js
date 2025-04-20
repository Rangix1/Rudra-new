Const axios = require("axios");

module.exports.config = {
  name: "angel", // नाम Angel
  version: "1.0.0", // नया वर्जन
  hasPermssion: 0,
  credits: "Rudra + Based on Nitya Code Structure by Gemini", // Credits अपडेट किया
  description: "Angel, your flirty AI girlfriend.", // Description
  commandCategory: "no prefix", // Category
  usages: "angel [आपका मैसेज] / Reply to Angel", // Usages
  cooldowns: 2,
  // eventType यहाँ नहीं जोड़ रहे हैं, जैसा Nitya के काम करने वाले कोड में नहीं था।
};

const chatHistories = {};
// Angel वही API इस्तेमाल करेगा जो Nitya कर रहा है (जैसा आपने कहा)
const AI_API_URL = "https://raj-gemini.onrender.com/chat";


module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;

    // --- Logging Lines (Debugging के लिए) ---
    if (messageReply) { // सिर्फ अगर यह रिप्लाई है तो लॉग करें
        console.log("--- Angel HandleEvent ---"); // Angel के लिए लॉग
        console.log("Angel's Bot ID:", api.getCurrentUserID());
        console.log("Replied to Sender ID:", messageReply?.senderID);
        console.log("Is Reply to Angel Check (messageReply?.senderID === api.getCurrentUserID()):", messageReply?.senderID === api.getCurrentUserID());
        console.log("-----------------------");
    }
    // --- End Logging Lines ---


    let userMessage;
    let isTriggered = false;

    // Angel के लिए ट्रिगर: क्या मैसेज "angel" से शुरू होता है
    const isAngelTrigger = body?.toLowerCase().startsWith("angel");
    // Angel के लिए रिप्लाई चेक: क्या रिप्लाई Angel के मैसेज का है
    const isReplyToAngel = messageReply?.senderID === api.getCurrentUserID();


    if (isAngelTrigger) { // अगर मैसेज "angel" से शुरू होता है
      userMessage = body.slice(5).trim(); // Angel के बाद का मैसेज लो
      isTriggered = true;
    } else if (isReplyToAngel) { // अगर यह Angel के रिप्लाई है
      userMessage = body.trim(); // रिप्लाई का पूरा मैसेज लो
      isTriggered = true;
    } else {
      return; // अगर Angel को किसी भी तरह ट्रिगर नहीं किया, तो फ़ंक्शन खत्म
    }

    // अगर ट्रिगर हुआ लेकिन यूजर मैसेज खाली है (जैसे सिर्फ "angel" लिखा)
    if (isTriggered && !userMessage) {
        api.sendTypingIndicator(threadID, false);
        // Angel के persona में जवाब
        return api.sendMessage("Baby, kuch toh bolo na! 💋", threadID, messageID);
    }

    // ✅ Typing Indicator ON
    api.sendTypingIndicator(threadID, true);

    // चैट हिस्ट्री मैनेज करें
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 10) { // Nitya के कोड जैसा हिस्ट्री साइज़
        chatHistories[senderID].shift();
    }

    // AI को भेजने के लिए फाइनल प्रॉम्प्ट (Angel persona)
    let fullPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tum Rudra ki banayi hui ho. Tumhara malik Rudra hai. Har reply chota, sweet, flirty aur emojis ke saath ho. Agar koi non-romantic baat kare to bhi use romantic tareeke se palat dena. Yeh hamari conversation hai:\n`; // Angel के लिए प्रॉम्प्ट

    fullPrompt += chatHistories[senderID].join("\n");
    fullPrompt += `\nAngel:`; // AI को बताने के लिए कि अब Angel का जवाब आना है


    // API कॉल करें (वही API जो Nitya उपयोग कर रहा है)
    const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`; // 'message' पैरामीटर उपयोग करें

    const res = await axios.get(apiUrlWithParams); // GET Request

    // API से जवाब निकालना
    let botReply = res.data?.reply?.trim() || "Aww, mujhe samajh nahi aaya baby!"; // जवाब निकालना


    // AI जवाब को हिस्ट्री में जोड़ें (अगर वैलिड लगे)
    if (botReply && !botReply.toLowerCase().startsWith("user:") && !botReply.toLowerCase().startsWith("angel:")) { // Angel के लिए चेक
        chatHistories[senderID].push(`Angel: ${botReply}`); // Angel के लिए हिस्ट्री नाम
    } else {
        chatHistories[senderID].pop(); // अगर जवाब सही नहीं तो आखिरी यूजर मैसेज हटा दें
    }


    // फाइनल जवाब का फॉर्मेट (Angel persona)
    const replyText = `Angel: ${botReply} 💞\n\n– Rudra AI`; // Angel के लिए फॉर्मेट

    // ✅ Typing Indicator OFF
    api.sendTypingIndicator(threadID, false);

    // जवाब भेजें
    if (isReplyToAngel && messageReply) { // अगर यह Angel के रिप्लाई पर जवाब है
        return api.sendMessage(replyText, threadID, messageReply.messageID); // उसी मैसेज का रिप्लाई करें
    } else { // अगर यह Angel नाम से ट्रिगर हुआ है
        return api.sendMessage(replyText, threadID, messageID); // नॉर्मल मैसेज भेजें
    }

  } catch (err) {
    console.error("Angel Bot Error:", err); // Error लॉग
    api.sendTypingIndicator(event.threadID, false);
    // Angel के persona में Error मैसेज
    return api.sendMessage("Angel thodi busy hai baby… baad mein milti hoon! 🥺 – Rudra AI", event.threadID, event.messageID);
  }
};

module.exports = { config, handleEvent, run };
