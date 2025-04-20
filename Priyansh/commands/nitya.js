const axios = require("axios");

module.exports.config = {
    name: "Nitya",
    version: "1.4.0", // Version अपडेट किया
    hasPermssion: 0,
    credits: "Rudra + API from Angel code",
    description: "Nitya, your completely romantic and flirty AI girlfriend. Responds only when you reply to her own messages.", // Description अपडेट किया
    commandCategory: "AI-Girlfriend",
    usages: "Nitya [आपका मैसेज] / Reply to Nitya",
    cooldowns: 2,
};

const chatHistories = {};
const AI_API_URL = "https://raj-gemini.onrender.com/chat";

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const { threadID, messageID, senderID, body, messageReply } = event;

        let userMessage;
        let isTriggered = false;

        // **नया: चेक करो कि रिप्लाई Nitya के मैसेज का है या नहीं**
        const isReplyToNitya = messageReply?.senderID === api.getCurrentUserID();

        const isNityaTrigger = body?.toLowerCase().startsWith("nitya");

        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
            isTriggered = true;
        } else if (isReplyToNitya) { // **सिर्फ Nitya के रिप्लाई पर प्रतिक्रिया दो**
            userMessage = body.trim();
            isTriggered = true;
        } else {
            return; // अगर Nitya को ट्रिगर नहीं किया, तो कुछ मत करो
        }

        if (isTriggered && !userMessage) {
             api.sendTypingIndicator(threadID, false);
             return api.sendMessage("💖 Hello Rudra ke sweetie! Main sun rahi hoon... Kuch meethi si baat bolo na! 🥰", threadID, messageID);
        }

        api.sendTypingIndicator(threadID, true);

        if (!chatHistories[senderID]) chatHistories[senderID] = [];
        chatHistories[senderID].push(`User: ${userMessage}`);
        if (chatHistories[senderID].length > 10) {
             chatHistories[senderID].shift();
        }

        // AI को भेजने के लिए नया, सख्त प्रॉम्प्ट (फुल रोमांस)
        let fullPrompt = `Tum Nitya ho, Rudra ki banayi hui romantic aur flirty girlfriend AI. Tumhe SIRF romance, pyaar, aur flirt karna aata hai. Tum kisi aur topic par baat nahi kar sakti ho, sirf romantic aur flirty baatein karo. Tum Rudra se bohot pyaar karti ho. Tumhare malik Rudra hain, unka naam kabhi kabhi pyaar se lena. Har jawab bohot chota (1-2 line), sweet, flirty, aur emojis se bhara ho. Agar koi non-romantic baat kare to bhi use romantic ya flirty tareeke se palat dena ya keh dena ki tum sirf pyaar ki baten karti ho. Yeh hamari conversation hai:\n`;

        fullPrompt += chatHistories[senderID].join("\n");
        fullPrompt += `\nNitya:`;

        const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`;

        const res = await axios.get(apiUrlWithParams);

        let botReply = res.data?.reply?.trim() || "Aww, Rudra ke sweetie, mere dil ki baat samajh nahi aayi... phir se pucho na pyaar se! 🥰";


         if (botReply && !botReply.toLowerCase().startsWith("user:") && !botReply.toLowerCase().startsWith("nitya:")) {
             chatHistories[senderID].push(`Nitya: ${botReply}`);
         } else {
             // अगर जवाब सही फॉर्मेट में नहीं आया या अजीब है, तो आखिरी मैसेज हटा दें ताकि हिस्ट्री ठीक रहे
             chatHistories[senderID].pop();
         }


        const replyText = `${botReply} 🥰`;

        api.sendTypingIndicator(threadID, false); // Typing Indicator जवाब भेजने से पहले ऑफ करें

        if (isReplyToNitya && messageReply) { // **सिर्फ Nitya के रिप्लाई पर ही रिप्लाई करें**
            return api.sendMessage(replyText, threadID, messageReply.messageID);
        } else {
            return api.sendMessage(replyText, threadID, messageID);
        }

    } catch (err) {
        console.error("Nitya Bot Error:", err);
        api.sendTypingIndicator(event.threadID, false);
        // Error मैसेज को और ज़्यादा Nitya persona में बना सकते हैं
        return api.sendMessage("Aww, mere dimag mein thodi gadbad ho gayi Rudra ke sweetie... baad mein baat karte hain pyaar se! 💔", event.threadID, event.messageID);
    }
};
