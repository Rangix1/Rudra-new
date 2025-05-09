const axios = require("axios"); const fs = require("fs");

// User name cache const userNameCache = {}; let hornyMode = false;

// Voice reply generator async function getVoiceReply(text) { const voiceApiUrl = https://api.voicerss.org/?key=YOUR_API_KEY&hl=hi-in&src=${encodeURIComponent(text)}; try { const response = await axios.get(voiceApiUrl, { responseType: 'arraybuffer' }); const audioData = response.data; const audioPath = './voice_reply.mp3'; fs.writeFileSync(audioPath, audioData); return audioPath; } catch (error) { console.error("Voice Error:", error); return null; } }

// GIF fetcher async function getGIF(query) { const giphyApiKey = "dc6zaTOxFJmzC"; const giphyUrl = https://api.giphy.com/v1/gifs/search?api_key=${giphyApiKey}&q=${encodeURIComponent(query)}&limit=1; try { const response = await axios.get(giphyUrl); return response.data.data[0]?.images?.original?.url; } catch (error) { console.error("GIF Error:", error); return null; } }

module.exports.config = { name: "fighter", version: "2.0", hasPermssion: 0, credits: "Rudra + OpenAI + Fighter Custom", description: "Gaalion wali Nitya - Sadakchaap bindaas AI girlfriend (Fighter Mode)", commandCategory: "AI-Girlfriend", usages: "Fighter [Message] / Reply", cooldowns: 2, };

const chatHistories = {}; const AI_API_URL = "https://raj-gemini.onrender.com/chat";

async function getUserName(api, userID) { if (userNameCache[userID]) return userNameCache[userID]; try { const userInfo = await api.getUserInfo(userID); const name = userInfo?.[userID]?.name || "bhadwe"; userNameCache[userID] = name; return name; } catch (error) { return "bhadwe"; } }

async function toggleHornyMode(body) { if (body.toLowerCase().includes("horny mode on")) { hornyMode = true; return "Horny Mode ON... Ab chalu karein dirty game!"; } else if (body.toLowerCase().includes("horny mode off")) { hornyMode = false; return "Horny Mode OFF... Ab shaant ho jao thode der."; } return null; }

module.exports.handleEvent = async function ({ api, event }) { try { const { threadID, messageID, senderID, body, messageReply } = event; const isFighterTrigger = body?.toLowerCase().startsWith("fighter"); const isReplyToBot = messageReply?.senderID === api.getCurrentUserID();

if (!isFighterTrigger && !isReplyToBot) return;

    const userName = await getUserName(api, senderID);
    const userMessage = isFighterTrigger ? body.slice(7).trim() : body.trim();
    if (!userMessage) return api.sendMessage("Bhosdike kuch to likh!", threadID, messageID);

    const hornyToggle = await toggleHornyMode(body);
    if (hornyToggle) return api.sendMessage(hornyToggle, threadID, messageID);

    if (!chatHistories[senderID]) chatHistories[senderID] = [];

    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 10) chatHistories[senderID].shift();

    // Gali Mode Check
    const rudraDetected = userMessage.toLowerCase().includes("rudra");

    let prompt = "Tu ek chhinal, bindaas sadakchaap ladki hai jiska naam Fighter hai. Tu har kisi se gali deke baat karti hai, attitude mein rehti hai. Jab 'Rudra' ka naam aaye, tu uski maa, behen, khandan sabko 10 line mein gali deti hai. Yeh chat hai:

"; prompt += chatHistories[senderID].join("\n"); prompt += "\nFighter:";

const apiUrlWithParams = `${AI_API_URL}?message=${encodeURIComponent(prompt)}`;

    const res = await axios.get(apiUrlWithParams);
    let botReply = res.data?.reply?.trim();

    if (!botReply) botReply = "Abey chutiye, dhang se baat kar!";
    else chatHistories[senderID].push(`Fighter: ${botReply}`);

    if (rudraDetected) {
        botReply = `Abey Rudra ke lode! Teri maa ki chut, behen ka bhosda, baap ki gand faad du! Pura khandan le aa, sabki maa chod dungi ek line mein! Tera khandani nalla bhosdika! Bhenchod, maa ki chut mein dhoondh raha tha kya reply? Gandu! Chal bhag bsdk!`;
    }

    const voicePath = await getVoiceReply(botReply);
    const gifUrl = await getGIF("angry girl");

    if (voicePath) api.sendMessage({ attachment: fs.createReadStream(voicePath) }, threadID);
    if (gifUrl) api.sendMessage({ body: "Dekh meri taangti gussa mein!", attachment: gifUrl }, threadID);

    return api.sendMessage(botReply, threadID, messageID);

} catch (err) {
    console.error("Fighter Bot Error:", err);
}

};

