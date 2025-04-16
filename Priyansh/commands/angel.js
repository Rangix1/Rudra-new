const axios = require("axios");

module.exports.config = {
    name: "angel",
    version: "2.0",
    hasPermssion: 0,
    credits: "Rudra",
    description: "Flirty Angel AI (slash reply + signature)",
    commandCategory: "no-prefix",
    usages: "chat with Angel",
    cooldowns: 2,
};

const API_URL = "https://raj-gemini.onrender.com/chat";
const chatHistories = {};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, messageID, senderID, body, messageReply } = event;
    if (!body) return;

    let userMessage = body.trim();
    let contextLine = "";

    // WhatsApp-style slash reply check
    if (body.includes("/") && body.indexOf("/") > 0) {
        const parts = body.split("/");
        const quoted = parts[0].trim();
        const reply = parts.slice(1).join("/").trim(); // In case msg has more than one "/"
        if (quoted && reply) {
            contextLine = `Usne bola: "${quoted}"\nUser: ${reply}`;
        }
    }

    // Normal direct message without slash
    if (!contextLine) {
        if (!body.toLowerCase().startsWith("angel")) return;
        userMessage = userMessage.replace(/^angel[:,\s]*/i, "");
        contextLine = `User: ${userMessage}`;
    }

    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(contextLine);

    if (chatHistories[senderID].length > 5) {
        chatHistories[senderID].shift();
    }

    const fullChat = chatHistories[senderID].join("\n");

    const gfPrompt = `Tumhara naam Angel hai. Tum ek flirty aur naughty girlfriend ho. Tum sirf 1 ya 2 line ka romantic, cute, thoda naughty jawab dogi. Koi tumhe bot ya AI bole to uski funny insult karogi. Apne aap ko hamesha real ladki hi kahogi. Chat ka context:\n\n${fullChat}`;

    api.setMessageReaction("⌛", messageID, () => {}, true);

    try {
        const res = await axios.get(`${API_URL}?message=${encodeURIComponent(gfPrompt)}`);
        let botReply = res.data.reply || "Baby, thoda aur clearly bolo na!";
        botReply += "\n\n– Rudra AI";

        chatHistories[senderID].push(`Angel: ${botReply}`);
        api.sendMessage(botReply, threadID, messageID);
        api.setMessageReaction("❤️", messageID, () => {}, true);
    } catch (err) {
        console.error(err);
        api.sendMessage("Aree baby, Angel ka mood thoda off hai... thodi der baad aaungi okay?", threadID, messageID);
        api.setMessageReaction("❌", messageID, () => {}, true);
    }
};

module.exports.run = () => {};
