const axios = require("axios");
const fs = require("fs");
const path = require("path");
const googleTTS = require("google-tts-api");

module.exports.config = {
  name: "kirti",  // Command name set to Kirti
  version: "1.0",
  credits: "LazerX + ChatGPT",  // Credits
  hasPermssion: 0,  // No permission required
  description: "Voice reply in Hindi with Kirti",  // Description of the command
  commandCategory: "AI",  // Command category
  usages: "Just type Kirti",
  cooldowns: 2,  // Cooldown time
  hasPrefix: false,  // No prefix
};

module.exports.handleEvent = async function ({ api, event }) {
  const { body, threadID, messageID, senderID } = event;

  // If message is empty or from the bot itself, return
  if (!body || senderID == api.getCurrentUserID()) return;

  const lowerBody = body.toLowerCase();
  
  // Check if the message contains the word 'kirti'
  if (!lowerBody.includes("kirti")) return;

  try {
    // Get text by removing "kirti" keyword from the message
    const text = body.replace(/kirti/gi, "").trim() || "Bolo baby, kya baat hai?";

    // Get voice URL from Google TTS API
    const url = googleTTS.getAudioUrl(text, {
      lang: 'hi',
      slow: false,
      host: 'https://translate.google.com',
    });

    // Define path to save the audio file
    const filePath = path.join(__dirname, `kirti_${senderID}.mp3`);

    // Download audio file
    const res = await axios.get(url, { responseType: "arraybuffer" });
    fs.writeFileSync(filePath, res.data);

    // Send the audio file as a message
    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(filePath),
    }, threadID, () => fs.unlinkSync(filePath), messageID);

  } catch (e) {
    console.log("Kirti voice error:", e);
    api.sendMessage("Kirti confuse ho gayi baby… fir se try karo.", threadID, messageID);
  }
};

module.exports.run = async () => {};
