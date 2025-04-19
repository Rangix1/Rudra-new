const fs = require("fs");
const axios = require("axios");
const path = require("path");
const crypto = require("crypto");

const APPID = "ga66b1d7";
const API_KEY = "60c1db3431422f04fc70679e0c52c693";

module.exports.config = {
  name: "kirti",
  version: "1.0",
  credits: "LazerX + Modified by ChatGPT",
  hasPrefix: false,
  description: "Hindi voice reply without prefix, trigger with 'kirti'",
  commandCategory: "voice",
  usages: "",
  cooldowns: 2,
};

module.exports.run = async function () {}; // Empty since we handle everything in handleEvent

module.exports.handleEvent = async function ({ api, event }) {
  const text = event.body;
  const botID = api.getCurrentUserID();

  if (!text || !text.toLowerCase().startsWith("kirti") || event.senderID == botID) return;

  const userQuery = text.slice(5).trim() || "kya hua baby?";
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

  try {
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
      new URLSearchParams({ text: userQuery }),
      { headers, responseType: "arraybuffer" }
    );

    const audioPath = path.join(__dirname, `voice_${event.senderID}.mp3`);
    fs.writeFileSync(audioPath, Buffer.from(response.data, "binary"));

    api.sendMessage(
      {
        body: "Kirti bolti hai...",
        attachment: fs.createReadStream(audioPath),
      },
      event.threadID,
      () => fs.unlinkSync(audioPath),
      event.messageID
    );
  } catch (err) {
    console.error("Kirti Error:", err);
    return api.sendMessage("Kirti thoda busy hai baby...", event.threadID, event.messageID);
  }
};
