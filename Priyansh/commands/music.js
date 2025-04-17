const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");

function deleteAfterTimeout(filePath, timeout = 10000) {
  setTimeout(() => {
    if (fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (!err) {
          console.log(`✅ Deleted file: ${filePath}`);
        } else {
          console.error(`❌ Error deleting file: ${err.message}`);
        }
      });
    }
  }, timeout);
}

module.exports = {
  config: {
    name: "music",
    version: "2.1.0",
    hasPermssion: 0,
    credits: "Lazer + Mirrykal",
    description: "Download YouTube song or video (Fast Optimized)",
    commandCategory: "Media",
    usages: "[songName] [optional: video]",
    cooldowns: 3,
  },

  run: async function ({ api, event, args }) {
    if (args.length === 0) {
      return api.sendMessage("⚠️ Bhai gaane ka naam likh to sahi! 😒", event.threadID);
    }

    const mediaType = args[args.length - 1].toLowerCase() === "video" ? "video" : "audio";
    const songName = mediaType === "video" ? args.slice(0, -1).join(" ") : args.join(" ");

    const processing = await api.sendMessage(`🔍 "${songName}" dhundh rahi hoon... Ruko zara!`, event.threadID, null, event.messageID);

    try {
      const results = await ytSearch(songName);
      if (!results || !results.videos.length) throw new Error("Kuch nahi mila! Naam sahi likho.");

      const top = results.videos[0];
      const videoUrl = `https://www.youtube.com/watch?v=${top.videoId}`;
      const thumbUrl = top.thumbnail;
      const safeTitle = top.title.replace(/[^a-zA-Z0-9]/g, "_");
      const cacheDir = path.join(__dirname, "cache");
      if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

      const thumbnailPath = path.join(cacheDir, `${safeTitle}.jpg`);
      const mediaPath = path.join(cacheDir, `${safeTitle}.${mediaType === "video" ? "mp4" : "mp3"}`);

      const downloadThumb = new Promise((resolve, reject) => {
        const file = fs.createWriteStream(thumbnailPath);
        https.get(thumbUrl, (res) => {
          res.pipe(file);
          file.on("finish", () => {
            file.close(resolve);
          });
        }).on("error", reject);
      });

      const getMediaUrl = `https://arun-xapi.onrender.com/download?url=${encodeURIComponent(videoUrl)}&type=${mediaType}`;
      const mediaRes = await axios.get(getMediaUrl);
      if (!mediaRes.data.file_url) throw new Error("Media download link nahi mila.");

      const mediaUrl = mediaRes.data.file_url.replace("http:", "https:");

      const downloadMedia = new Promise((resolve, reject) => {
        const file = fs.createWriteStream(mediaPath);
        https.get(mediaUrl, (res) => {
          if (res.statusCode === 200) {
            res.pipe(file);
            file.on("finish", () => file.close(resolve));
          } else {
            reject(new Error(`Status: ${res.statusCode}`));
          }
        }).on("error", reject);
      });

      await Promise.all([downloadThumb, downloadMedia]);

      await api.sendMessage({
        attachment: fs.createReadStream(thumbnailPath),
        body: `🎶 ${top.title}\nThoda aur wait karo, file aa rahi hai...`,
      }, event.threadID);

      await api.sendMessage({
        attachment: fs.createReadStream(mediaPath),
        body: `✅ Aapka ${mediaType === "video" ? "video" : "gaana"} ready hai! Enjoy!`,
      }, event.threadID, event.messageID);

      deleteAfterTimeout(thumbnailPath, 10000);
      deleteAfterTimeout(mediaPath, 10000);

    } catch (err) {
      console.error("❌ Error:", err.message);
      api.sendMessage(`❌ Error: ${err.message}`, event.threadID, event.messageID);
    }
  },
};
