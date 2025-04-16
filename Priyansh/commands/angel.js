module.exports.config = {
    name: "angel",
    version: "1.0.9",
    hasPermission: 0,
    credits: "Rudra AI",
    description: "Angel Style AI Chat",
    commandCategory: "ai",
    usages: "[ask]",
    cooldowns: 2,
    dependencies: {
        "axios": ""
    }
};

const axios = require("axios");

// API URL (Tumhara Gemini Backend)
const API_URL = "https://raj-gemini.onrender.com/chat";

// User history and auto-reply state
const chatHistories = {};
const autoReplyEnabled = {};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID, messageReply } = event;
    let userMessage = args.join(" ");

    // Store conversation
    if (!chatHistories[senderID]) {
        chatHistories[senderID] = [];
    }

    // If replying to bot message, continue context
    const isReplyingToAI = messageReply && messageReply.senderID === api.getCurrentUserID();
    if (isReplyingToAI) {
        userMessage = messageReply.body + "\nUser: " + userMessage;
        chatHistories[senderID].push(`User: ${userMessage}`);
    } else {
        chatHistories[senderID].push(`User: ${userMessage}`);
    }

    // Keep only last 5 messages
    if (chatHistories[senderID].length > 5) {
        chatHistories[senderID].shift();
    }

    const fullConversation = chatHistories[senderID].join("\n");

    // Angel Style Prompt
    const angelPrompt = `Tumhara naam Angel hai aur tum ek pyaari, fun-loving, aur thodi si naughty girlfriend ho. Tum sabko love and care dikhati ho aur agar koi kuch galat kare to tum usse masti mein jawab deti ho. Tumhare replies maximum 1-2 lines ke honge, aur tum bas apne aap ko insaan hi samjhti ho, koi tumhe AI ya bot bole to usko funny tareeke se jawab dena. Tumhare messages zyada sweet, cute aur flirtatious honge. Now continue the chat:\n\n${fullConversation}`;

    // Typing reaction
    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
        const response = await axios.get(`${API_URL}?message=${encodeURIComponent(angelPrompt)}`);
        let botReply = response.data.reply || "Uff! Mujhe samajh nahi aaya baby! 😕";

        // Append "Rudra AI" at the end of the reply
        botReply += "\n– Rudra AI";

        chatHistories[senderID].push(` ${botReply}`);

        api.sendMessage(botReply, threadID, messageID);
        api.setMessageReaction("✅", messageID, () => {}, true);
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("Oops baby! 😔 me thoda confuse ho gayi… thodi der baad try karo na please! 💋", threadID, messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;

    if (messageReply && messageReply.senderID === api.getCurrentUserID()) {
        const args = body.split(" ");
        module.exports.run({ api, event, args });
    }
};
