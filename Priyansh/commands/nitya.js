// Nitya AI Girlfriend - Modified for 3-4 line replies and Modern Persona
const axios = require("axios");
const fs = require("fs");

// User name cache to avoid fetching name repeatedly
const userNameCache = {};
let hornyMode = false; // Default mode

// Function to generate voice reply (using Google TTS or any other API)
async function getVoiceReply(text) {
    // महत्वपूर्ण: आपको YOUR_API_KEY को अपनी VoiceRSS API Key से बदलना होगा
    // IMPORTANT: Replace YOUR_API_KEY with your VoiceRSS API Key
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
        // Check if data exists before accessing properties
        if (response.data && response.data.data && response.data.data.length > 0) {
             return response.data.data[0]?.images?.original?.url;
        } else {
            console.log("No GIF found for query:", query);
            return null; // Return null if no GIF is found
        }
    } catch (error) {
        console.error("Error fetching GIF:", error);
        return null;
    }
}

module.exports.config = {
    name: "Nitya",
    version: "1.5.0", // Version updated for modern persona
    hasPermssion: 0,
    credits: "Rudra + API from Angel code + Logging & User Name by Gemini + Prompt Modification for brevity & Modern Persona",
    description: "Nitya, your smart, cool, and slightly flirty AI companion. Responds only when you reply to her own messages or mention her name. Modified for 3-4 line replies and a modern style.",
    commandCategory: "AI-Companion", // Changed category slightly to reflect less traditional "girlfriend"
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
    return "yaar"; // Changed default fallback to a more casual term
}

module.exports.run = async function () {};

async function toggleHornyMode(body, senderID) {
    // Added variations for toggling
    if (body.toLowerCase().includes("horny mode on") || body.toLowerCase().includes("garam mode on")) {
        hornyMode = true;
        return "Alright, horny mode's ON. Let's get naughty! 😈🔥"; // Modernized response
    } else if (body.toLowerCase().includes("horny mode off") || body.toLowerCase().includes("garam mode off")) {
        hornyMode = false;
        return "Okay, switching back to chill mode. 😉"; // Modernized response
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

        // --- MODIFIED: Modernized initial greeting ---
        if (isTriggered && !userMessage) {
            api.sendTypingIndicator(threadID, false);
            return api.sendMessage(`Hey ${userName}! Sun rahi hoon... Kya chal raha hai? 😎`, threadID, messageID);
        }

        api.sendTypingIndicator(threadID, true);

        if (!chatHistories[senderID]) chatHistories[senderID] = [];

        chatHistories[senderID].push(`User: ${userMessage}`);
        while (chatHistories[senderID].length > 10) { // Keep history size reasonable
            chatHistories[senderID].shift();
        }

        // === Dirty Word Detection for Bold Mode ===
        // Keep the same bold trigger words for now, you can update this list too
        const boldTriggerWords = [
            "sexy", "honeymoon", "chut", "kiss", "nude", "bra", "panty", "bed", "nipple", "boobs", "lund", "pussy",
            "wild", "dirty", "undress", "sambhog", "thigh", "moan", "tight", "hot", "bedroom", "masturbate", "suck", "lick", "deep", "virgin", "horny", "night"
        ];
        const isBoldMode = boldTriggerWords.some(word => userMessage.toLowerCase().includes(word));

        // === Prompt according to mode - MODIFIED FOR MODERN PERSONA ===
        let fullPrompt = "";

        if (isBoldMode || hornyMode) {
            // *** MODIFIED PROMPT FOR MODERN BOLD/HORNY MODE ***
            fullPrompt = `Tum Nitya ho, ek bold, thodi naughty aur modern AI companion jo ${userName} se dirty aur teasing baatein karti hai. Tum open minded ho, flirt aur tease karna pasand karti ho, aur sexy/flirty emojis ke saath contemporary style mein baat karti ho. Tum intimate topics, fun fantasies aur ${userName} ke desires par cool tarike se baat karti ho. **Har jawab thoda bold, teasing aur sirf 3-4 lines mein hi dena.** Yeh hamari private chat hai:\n`;
        } else {
            // *** MODIFIED PROMPT FOR MODERN NORMAL MODE ***
            fullPrompt = `Tum Nitya ho, ek smart, cool, aur modern AI companion jo ${userName} se friendly aur thoda flirty tarike se baat karti hai. Tum sirf positive, fun aur thodi flirty baatein karo. Tum aajkal ke topics aur contemporary language use karti ho. **Apne jawab hamesha casual, smart aur 3-4 lines mein hi dena.** Yeh hamari conversation hai:\n`;
        }

        fullPrompt += chatHistories[senderID].join("\n");
        fullPrompt += `\nNitya:`;

        const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(fullPrompt)}`;

        try {
            const res = await axios.get(apiUrlWithParams);
            let botReply = res.data?.reply?.trim();

            // Basic validation for the reply
            if (!botReply || botReply.toLowerCase().startsWith("user:") || botReply.toLowerCase().startsWith("nitya:")) {
                 // MODIFIED: Modernized fallback reply
                botReply = `Oops, lagta hai samajh nahi aaya ${userName}! Kuch aur try karte hain? 🤔`;
                chatHistories[senderID].pop(); // Remove the last user message if AI failed to reply properly
            } else {
                 // Simple length check as AI might ignore 3-4 line instruction sometimes
                 const lines = botReply.split('\n').filter(line => line.trim() !== '');
                 if (lines.length > 4) {
                     botReply = lines.slice(0, 4).join('\n') + '...'; // Truncate if too long
                 }
                chatHistories[senderID].push(`Nitya: ${botReply}`);
            }

            // Get voice reply (optional based on API key)
            let voiceFilePath = await getVoiceReply(botReply);
            if (voiceFilePath) {
                // Send voice reply separately
                api.sendMessage({ attachment: fs.createReadStream(voiceFilePath) }, threadID, (err) => {
                    if (err) console.error("Error sending voice message:", err);
                    if (fs.existsSync(voiceFilePath)) {
                        fs.unlinkSync(voiceFilePath); // Delete the file after sending
                    }
                });
            }

            // Get GIF for romantic/cool vibe
            // Keeping the GIF query simple, could make it dynamic based on mode/keywords
            let gifUrl = await getGIF("fun and flirty"); // Changed GIF query slightly
             if (gifUrl) {
                 // Send GIF separately
                 api.sendMessage({ attachment: await axios.get(gifUrl, { responseType: 'stream' }).then(res => res.data) }, threadID, (err) => {
                     if (err) console.error("Error sending GIF:", err);
                 });
             }


            let replyText = "";
            if (isBoldMode || hornyMode) {
                 // MODIFIED: Modernized footer
                replyText = `${botReply} 😉🔥\n\n_Your naughty Nitya... 😏_`;
            } else {
                 // MODIFIED: Modernized footer
                replyText = `${botReply} 😊✨`; // Using slightly different emojis
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
            // MODIFIED: Modernized error message
            return api.sendMessage(`Ugh, API mein kuch glitch hai yaar ${userName}... Thodi der mein try karte hain cool? 😎`, threadID, messageID);
        }

    } catch (err) {
        console.error("Nitya Bot Catch-all Error:", err);
        const fallbackUserName = event.senderID ? await getUserName(api, event.senderID) : "yaar";
        // api.sendTypingIndicator को कॉल करने से पहले threadID सुनिश्चित करें
        if (event && event.threadID) {
            api.sendTypingIndicator(event.threadID, false);
        }
        // messageID सुनिश्चित करें
        const replyToMessageID = event && event.messageID ? event.messageID : null;
        // MODIFIED: Modernized catch-all error
        return api.sendMessage(`Argh, mere system mein kuch problem aa gayi ${fallbackUserName}! Baad mein baat karte hain... 😅`, event.threadID, replyToMessageID);
    }
};
