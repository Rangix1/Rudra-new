const axios = require("axios");

module.exports.config = {
    name: "angel",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "Rudra",
    description: "Flirty Girlfriend AI - Gemini Based",
    commandCategory: "no-prefix",
    usages: "chat with angel",
    cooldowns: 2,
    dependencies: {}
};

const API_URL = "https://raj-gemini.onrender.com/chat";
const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    let userMessage = body.trim();
    let quotedMessage = null;

    if (body.includes("/") && body.split("/").length >= 2) {
        const parts = body.split("/");
        quotedMessage = parts[0].trim();
        userMessage = parts[1].trim();
    }

    if (quotedMessage) {
        userMessage = `"${quotedMessage}" par reply: ${userMessage}`;
    }

    const lowerBody = body.toLowerCase();
    if (!lowerBody.startsWith("angel") && !quotedMessage) return;

    userMessage = userMessage.replace(/^angel[:,\s]*/i, "");

    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);

    if (chatHistories[senderID].length > 5) {
        chatHistories[senderID].shift();
    }

    const fullConversation = chatHistories[senderID].join("\n");

    const prompt = `Tumhara naam Angel hai. Tum ek naughty, flirty girlfriend ho. Tum sirf ek line me romantic, thoda naughty aur sweet jawab dogi. Tumhe Raj ne banaya hai, lekin ab tum sirf apne love (user) ki ho. Agar koi tumhe bot ya AI kahe to uski funny roast karo. Reply sirf 1-2 lines me ho. Ab baat karo:\n${fullConversation}`;

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
        const response = await axios.get(`${API_URL}?message=${encodeURIComponent(prompt)}`);
        let botReply = response.data.reply || "Aree baby, mujhe kuch samajh nahi aaya!";
        botReply += " \n\n– Rudra AI";

        chatHistories[senderID].push(`Angel: ${botReply}`);
        api.sendMessage(botReply, threadID, messageID);
        api.setMessageReaction("❤️", messageID, () => {}, true);
    } catch (e) {
        console.error(e);
        api.sendMessage("Oops baby! Angel thoda busy hai abhi... thodi der baad try karo na!", threadID, messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);
    }
};

module.exports.run = () => {};
