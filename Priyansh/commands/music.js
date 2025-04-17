const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");

function deleteAfterTimeout(filePath, timeout = 10000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) console.log(`✅ Deleted: ${filePath}`);
      });
    }
  }, timeout);
}

module.exports.config = {
  name: "music",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Modified by ChatGPT",
  description: "Download YouTube audio/video by name",
  commandCategory: "media",
  usages: "[song name] [video (optional)]",
  cooldowns: 3,
};

module.exports.run = async function ({ api, event, args }) {
  if (args.length === 0) {
    return api.sendMessage("❗ Gaane ka naam likho!", event.threadID);
  }

  const mediaType = args[args.length - 1].toLowerCase() === "video" ? "video" : "audio";
  const songName = mediaType === "video" ? args.slice(0, -1).join(" ") : args.join(" ");

  const waitMsg = await api.sendMessage(`🔍 "${songName}" dhoondh rahi hoon...`, event.threadID, null, event.messageID);

  try {
    const searchResults = await ytSearch(songName);
    if (!searchResults || !searchResults.videos.length) {
      throw new Error("Gaana nahi mila. Naam check karo.");
    }

    const top = searchResults.videos[0];
    const videoUrl = `https://www.youtube.com/watch?v=${top.videoId}`;
    const safeTitle = top.title.replace(/[^a-zA-Z0-9]/g, "_");
    const thumbPath = __dirname + `/cache/${safeTitle}.jpg`;

    const thumbnail = fs.createWriteStream(thumbPath);
    await new Promise((resolve, reject) => {
      https.get(top.thumbnail, (res) => {
        res.pipe(thumbnail);
        thumbnail.on("finish", () => {
          thumbnail.close(resolve);
        });
      }).on("error", reject);
    });

    await api.sendMessage({
      body: `🎶 ${top.title}\n⏳ Downloading ${mediaType}...`,
      attachment: fs.createReadStream(thumbPath),
    }, event.threadID);

    deleteAfterTimeout(thumbPath);

    const dlApi = `https://arun-xapi.onrender.com/download?url=${encodeURIComponent(videoUrl)}&type=${mediaType}`;
    const res = await axios.get(dlApi);
    const fileUrl = res.data.file_url?.replace("http:", "https:");

    if (!fileUrl) throw new Error("File mil nahi rahi!");

    const ext = mediaType === "video" ? "mp4" : "mp3";
    const filePath = __dirname + `/cache/${safeTitle}.${ext}`;
    const file = fs.createWriteStream(filePath);

    await new Promise((resolve, reject) => {
      https.get(fileUrl, (response) => {
        if (response.statusCode === 200) {
          response.pipe(file);
          file.on("finish", () => file.close(resolve));
        } else {
          reject("Download failed!");
        }
      }).on("error", reject);
    });

    await api.sendMessage({
      body: `✅ Done! Enjoy your ${mediaType}!`,
      attachment: fs.createReadStream(filePath),
    }, event.threadID, () => deleteAfterTimeout(filePath), event.messageID);

  } catch (err) {
    console.error(err);
    api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
  }
};
