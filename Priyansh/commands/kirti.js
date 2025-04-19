const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

const APPID = "ga66b1d7";
const API_SECRET = "3e65795258e22878560e5d5073e786b7";
const API_KEY = "60c1db3431422f04fc70679e0c52c693";

module.exports.config = {
  name: "kirti", // Command name set to Kirti
  version: "1.0",
  credits: "LazerX",
  hasPrefix: false,  // No prefix, works on "Kirti"
  description: "Voice reply in Hindi with Kirti's voice",
  usages: "",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const text = event.body;

  // Check if the message contains "Kirti"
  if (!text.toLowerCase().includes("kirti") || event.senderID == api.getCurrentUserID()) return;

  try {
    const ts = Math.floor(Date.now() / 1000).toString();
    const param = {
      aue: "lame",
      auf: "audio/L16;rate=16000",
      voice_name: "aisxping", // Female voice (adjusted to make Kirti feel personal)
      engine_type: "intp65",
      text_type: "text",
      vcn: "aisxping", // Using the same female voice for Kirti
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
      new URLSearchParams({ text }),
      { headers, responseType: "arraybuffer" }
    );

    const audioPath = path.join(__dirname, `voice_${event.senderID}.mp3`);
    fs.writeFileSync(audioPath, Buffer.from(response.data, "binary"));

    api.sendMessage(
      {
        body: "",
        attachment: fs.createReadStream(audioPath),
      },
      event.threadID,
      () => fs.unlinkSync(audioPath),
      event.messageID
    );
  } catch (err) {
    console.error("Voice Error:", err);
    api.sendMessage("Kuch error aaya bhai, voice generate nahi hui.", event.threadID);
  }
};const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

const APPID = "ga66b1d7";
const API_SECRET = "3e65795258e22878560e5d5073e786b7";
const API_KEY = "60c1db3431422f04fc70679e0c52c693";

module.exports.config = {
  name: "kirti", // Command name set to Kirti
  version: "1.0",
  credits: "LazerX",
  hasPrefix: false,  // No prefix, works on "Kirti"
  description: "Voice reply in Hindi with Kirti's voice",
  usages: "",
  cooldowns: 2,
};

module.exports.handleEvent = async function ({ api, event }) {
  const text = event.body;

  // Check if the message contains "Kirti"
  if (!text.toLowerCase().includes("kirti") || event.senderID == api.getCurrentUserID()) return;

  try {
    const ts = Math.floor(Date.now() / 1000).toString();
    const param = {
      aue: "lame",
      auf: "audio/L16;rate=16000",
      voice_name: "aisxping", // Female voice (adjusted to make Kirti feel personal)
      engine_type: "intp65",
      text_type: "text",
      vcn: "aisxping", // Using the same female voice for Kirti
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
      new URLSearchParams({ text }),
      { headers, responseType: "arraybuffer" }
    );

    const audioPath = path.join(__dirname, `voice_${event.senderID}.mp3`);
    fs.writeFileSync(audioPath, Buffer.from(response.data, "binary"));

    api.sendMessage(
      {
        body: "",
        attachment: fs.createReadStream(audioPath),
      },
      event.threadID,
      () => fs.unlinkSync(audioPath),
      event.messageID
    );
  } catch (err) {
    console.error("Voice Error:", err);
    api.sendMessage("Kuch error aaya bhai, voice generate nahi hui.", event.threadID);
  }
};
