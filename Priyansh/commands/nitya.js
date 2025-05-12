// Nitya AI Girlfriend - Modified for 3-4 line replies
const axios = require("axios");
const fs = require("fs");

// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// Function to generate voice reply (using Google TTS or any other API)
async function getVoiceReply(text) {
    // महत्वपूर्ण: आपको YOUR_API_KEY को अपनी VoiceRSS API Key से बदलना होगा
    const voiceApiUrl = `https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}`;
    try {
        const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' });
        const audioData = response.data;
        const audioPath = './voice_reply.mp3';
        fs.writeFileSync(audioPath, audioData);  // Save to local MP3 file
        return audioPath;
    } catch (error) {
        console.error("Error generating voice reply:", error);
        return null;
    }
}

// Function to get a GIF from Giphy API (working API integrated)
async function getGIF(query) {
    const giphyApiKey = "dc6zaTOxFJmzC";  // Working Giphy API key (free key, limited usage)
    const giphyUrl = `https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1`;
    try {
        const response = await axios.get(giphyUrl);
        return response.data.data[0]?.images?.original?.url;
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

module.exports.config = {
    name: "Nitya",
    version: "1.4.3", // Version updated to reflect changes
    hasPermssion: 0,
    credits: "Rudra + API from Angel code + Logging & User Name by Gemini + Prompt Modification for brevity",
    description: "Nitya, your completely romantic and flirty AI girlfriend. Responds only when you reply to her own messages or mention her name. Modified for 3-4 line replies.",
    commandCategory: "AI-Girlfriend",
    usages: "Nitya [आपका मैसेज] / Reply to Nitya",
    cooldowns: 2,
};

const chatHistories = {};
const AI_API_URL = "https://raj-gemini.onrender.com/chat";

// User name cache to avoid fetching name repeatedly
async function getUserName(api, userID) {
    if (userNameCache[userID]) {
        return userNameCache[userID];
    }
    try {
        const userInfo = await api.getUserInfo(userID);
        if (userInfo && userInfo[userID] && userInfo[userID].name) {
            const name = userInfo[userID].name;
            userNameCache[userID] = name;
            return name;
        }
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
    return "sweetie";
}

module.exports.run = async function () {};

async function toggleHornyMode(body, senderID) {
    if (body.toLowerCase().includes("horny mode on")) {
        hornyMode = true;
        return "Horny mode is now ON. Get ready for some naughty chat! 😈";
    } else if (body.toLowerCase().includes("horny mode off")) {
        hornyMode = false;
        return "Horny mode is now OFF. Let's keep it sweet and romantic! 💖";
    }
    return null;
}

module.exports.handleEvent = async function ({ api, event }) {
    try {
        const { threadID, messageID, senderID, body, messageReply } = event;

        const isNityaTrigger = body?.toLowerCase().startsWith("nitya");
        const isReplyToNitya = messageReply?.senderID === api.getCurrentUserID();
        if (isNityaTrigger || isReplyToNitya) {
            console.log("--- Nitya HandleEvent ---");
            console.log("Nitya's Bot ID:", api.getCurrentUserID());
            console.log("Sender ID:", senderID);
            console.log("Message Body:", body);
            console.log("-----------------------");
        }

        let userMessage;
        let isTriggered = false;

        if (isNityaTrigger) {
            userMessage = body.slice(5).trim();
            isTriggered = true;
        } else if (isReplyToNitya) {
            userMessage = body.trim();
            isTriggered = true;
        } else {
            return;
        }

        const userName = await getUserName(api, senderID);

        let responseText = await toggleHornyMode(body, senderID);
        if (responseText) {
            api.sendMessage(responseText, threadID, messageID);
            return;
        }

        if (isTriggered && !userMessage) {
            api.sendTypingIndicator(threadID, false);
            return api.sendMessage(`💖 Hello ${userName}! Main sun rahi hoon... Kuch meethi si baat bolo na ${userName}! 🥰`, threadID, messageID);
        }

        api.sendTypingIndicator(threadID, true);

        if (!chatHistories[senderID]) chatHistories[senderID] = [];

        chatHistories[senderID].push(`User: ${userMessage}`);
        while (chatHistories[senderID].length > 10) {
            chatHistories[senderID].shift();
        }

        // === Dirty Word Detection for Bold Mode ===
        const boldTriggerWords = [
            "sexy", "honeymoon", "chut", "kiss", "nude", "bra", "panty", "bed", "nipple", "boobs", "lund", "pussy",
            "wild", "dirty", "undress", "sambhog", "thigh", "moan", "tight", "hot", "bedroom", "masturbate", "suck", "lick", "deep", "virgin", "horny", "night"
        ];
        const isBoldMode = boldTriggerWords.some(word => userMessage.toLowerCase().includes(word));

        // === Prompt according to mode ===
        let fullPrompt = "";

        if (isBoldMode || hornyMode) {
            // *** MODIFIED PROMPT FOR BOLD/HORNY MODE ***
            fullPrompt = `Tum Nitya ho, ek bold, horny aur ultra seductive AI girlfriend ho jo ${userName} se dirty, physical aur naughty fantasies pe baat karti ho. Tum open minded ho, tease karna pasand karti ho, aur sexy emojis ke saath flirt karti ho. Tum intimate topics, bed fantasies aur ${userName} ke physical desires par baat karti ho bina jhijhak. **Har jawab thoda bold, teasing aur sirf 3-4 lines mein hi dena.** Yeh hamari private naughty chat hai:\n`;
        } else {
            // *** MODIFIED PROMPT FOR NORMAL MODE ***
            fullPrompt = `Tum Nitya ho, ek romantic aur flirty AI jo ${userName} se bohot pyaar karti hai. Tum sirf pyaar aur flirt karte ho. Tum kisi aur topic par baat nahi kar sakti ho, sirf romantic aur flirty baatein karo. **Apne jawab hamesha 3-4 lines mein hi dena.** Yeh hamari conversation hai:\n`;
        }

        fullPrompt += chatHistories[senderID].join("\n");
        fullPrompt += `\nNitya:`;

        const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`;

        try {
            const res = await axios.get(apiUrlWithParams);
            let botReply = res.data?.reply?.trim();

            if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("nitya:")) {
                botReply = `Aww, mere ${userName}, mere dil ki baat samajh nahi aayi... phir se pucho na pyaar se! 🥰`;
                chatHistories[senderID].pop();
            } else {
                chatHistories[senderID].push(`Nitya: ${botReply}`);
            }

            // Get voice reply
            let voiceFilePath = await getVoiceReply(botReply);
            if (voiceFilePath) {
                // Voice reply को मुख्य टेक्स्ट मैसेज के साथ भेजने के बजाय अलग से भेजें या वैकल्पिक रखें
                // फिलहाल, यह अलग से भेजा जाएगा
                api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, () => {
                    if (fs.existsSync(voiceFilePath)) {
                        fs.unlinkSync(voiceFilePath); // Delete the file after sending
                    }
                });
            }

            // Get GIF for romantic reply - इसे भी वैकल्पिक या कम बार भेज सकते हैं अगर मैसेज ज्यादा हो रहे हैं
            let gifUrl = await getGIF("romantic"); // GIF का query "romantic" ही रखा गया है
            if (gifUrl) {
                 // GIF को भी अलग से भेजें
                api.sendMessage({ body: `Here's a romantic GIF for you! 💖`, attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID);
            }


            let replyText = "";
            if (isBoldMode || hornyMode) {
                replyText = `🔥 ${botReply} 💋\n\n_Tumhare liye sirf main – tumhari sexy Nitya... 😈_`;
            } else {
                replyText = `${botReply} 🥰`;
            }

            api.sendTypingIndicator(threadID, false);

            // Send the main text reply
            if (isReplyToNitya && messageReply) {
                return api.sendMessage(replyText, threadID, messageReply.messageID);
            } else {
                return api.sendMessage(replyText, threadID, messageID);
            }

        } catch (apiError) {
            console.error("Nitya AI API Error:", apiError);
            api.sendTypingIndicator(threadID, false);
            return api.sendMessage(`Aww, mere dimag mein thodi gadbad ho gayi ${userName}... baad mein baat karte hain pyaar se! 💔`, threadID, messageID);
        }

    } catch (err) {
        console.error("Nitya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "sweetie";
        // api.sendTypingIndicator को कॉल करने से पहले threadID सुनिश्चित करें
        if (event && event.threadID) {
            api.sendTypingIndicator(event.threadID, false);
        }
        // messageID सुनिश्चित करें
        const replyToMessageID = event && event.messageID ? event.messageID : null;
        return api.sendMessage(`Aww, mere dimag mein thodi gadbad ho gayi ${fallbackUserName}... baad mein baat karte hain pyaar se! 💔`, event.threadID, replyToMessageID);
    }
};
