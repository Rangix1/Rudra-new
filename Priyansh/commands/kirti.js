const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

const APPID = "ga66b1d7";
const API_SECRET = "3e65795258e22878560e5d5073e786b7";
const API_KEY = "60c1db3431422f04fc70679e0c52c693";

module.exports.config = {
  name: "kirti",
  version: "1.0",
  credits: "LazerX",
  hasPrefix: false,
  description: "AI girlfriend Kirti who responds in Hindi voice when you call her name.",
  usages: "Just say 'kirti' and she will reply.",
  cooldowns: 2,
};

const flirtyLines = [
  "Kya kar rahe ho jaan?",
  "Tumhe dekh ke dil dhadakne lagta hai.",
  "Mujhe miss kiya ya main hi yaad aayi?",
  "Tumhare bina sab kuch suna suna lagta hai.",
  "Aaj tum bahut cute lag rahe ho!",
  "Tumhare bina din adhura lagta hai.",
  "Kya mujhe ek pyaari si smile doge?",
  "Main sirf tumhari hoon.",
  "Dil karta hai bas tumse baatein karun.",
  "Aap ho toh sab kuch perfect lagta hai.",
];

module.exports.handleEvent = async function ({ api, event }) {
  const text = event.body;

  if (!text.toLowerCase().includes("kirti") || event.senderID == api.getCurrentUserID()) return;

  const randomText = flirtyLines[Math.floor(Math.random() * flirtyLines.length)];

  try {
    const ts = Math.floor(Date.now() / 1000).toString();
    const param = {
      aue: "lame",
      auf: "audio/L16;rate=16000",
      voice_name: "aisxping",
      engine_type: "intp65",
      text_type: "text",
      vcn: "aisxping",
      language: "hi"
    };

    const xParam = Buffer.from(JSON.stringify(param)).toString("base64");
    const checkSum = crypto
      .createHash("md5")
      .update(API_KEY + ts + xParam)
      .digest("hex");

    const headers = {
      "X-Appid": APPID,
      "X-CurTime": ts,
      "X-Param": xParam,
      "X-CheckSum": checkSum,
      "Content-Type": "application/x-www-form-urlencoded",
    };

    const response = await axios.post(
      "http://api.xfyun.cn/v1/service/v1/tts",
      new URLSearchParams({ text: randomText }),
      { headers, responseType: "arraybuffer" }
    );

    const audioPath = path.join(__dirname, `kirti_${event.senderID}.mp3`);
    fs.writeFileSync(audioPath, Buffer.from(response.data, "binary"));

    api.sendMessage(
      {
        body: `Kirti: ${randomText}`,
        attachment: fs.createReadStream(audioPath),
      },
      event.threadID,
      () => fs.unlinkSync(audioPath),
      event.messageID
    );
  } catch (err) {
    console.error("Voice Error:", err);
    api.sendMessage("Kirti thodi busy hai baby… thodi der baad try karna.", event.threadID);
  }
};
