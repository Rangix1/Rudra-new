const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ytSearch = require("yt-search");
const https = require("https");

module.exports = {
  config: {
    name: "mp3",
    version: "1.0.5", // Updated version
    hasPermssion: 0,
    credits: "Mirrykal (Updated & Repaired by Gemini)", // Updated credits
    description: "Download YouTube song as MP3 using yt-search and a direct download method.",
    commandCategory: "Media",
    usages: "[songName]", // Removed [type] for simplicity and focus on MP3
    cooldowns: 5,
    dependencies: {
      "yt-search": "",
      "axios": "", // Added axios as a dependency
    },
  },

  run: async function ({ api, event, args }) {
    const songName = args.join(" ");
    if (!songName) {
      return api.sendMessage("Please provide a song name to search.", event.threadID, event.messageID);
    }

    const processingMessage = await api.sendMessage(
      "✅ Searching for the song and preparing download...",
      event.threadID,
      null,
      event.messageID
    );

    try {
      const searchResults = await ytSearch(songName);
      if (!searchResults || !searchResults.videos.length) {
        throw new Error("No results found for your search query.");
      }

      const topResult = searchResults.videos[0];
      const videoUrl = `https://www.youtube.com/watch?v=${topResult.videoId}`;

      api.setMessageReaction("🔎", event.messageID, () => {}, true); // Indicate searching

      // Using a more direct method to fetch audio information (can be less reliable than a dedicated API)
      const infoUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;
      const { data: videoInfo } = await axios.get(infoUrl);

      if (!videoInfo || !videoInfo.title) {
        throw new Error("Could not retrieve video information.");
      }

      const titleForFilename = videoInfo.title.replace(/[^a-zA-Z0-9 \-_]/g, "");
      const filename = `${titleForFilename}.mp3`;
      const downloadDir = path.join(__dirname, "cache");
      const downloadPath = path.join(downloadDir, filename);

      if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir, { recursive: true });
      }

      // **Note:** Directly downloading MP3 from YouTube is complex and often requires using services or libraries like `ytdl-core` which might be blocked or require specific configurations. The following is a simplified attempt that might not always work and is prone to breaking. For a more robust solution, consider using a dedicated and reliable YouTube download API (though many have limitations or costs).

      const audioDownloadUrl = `https://yt-dlp-api.vercel.app/mp3?url=${encodeURIComponent(videoUrl)}`; // Re-introducing with caution

      api.setMessageReaction("⬇️", event.messageID, () => {}, true); // Indicate downloading

      try {
        const response = await axios({
          method: 'GET',
          url: audioDownloadUrl,
          responseType: 'stream',
        });

        const writer = fs.createWriteStream(downloadPath);
        response.data.pipe(writer);

        await new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });

        api.setMessageReaction("✅", event.messageID, () => {}, true); // Indicate download complete

        await api.sendMessage(
          {
            attachment: fs.createReadStream(downloadPath),
            body: `🎧 Title: ${videoInfo.title}\n\nHere is your song:`,
          },
          event.threadID,
          () => {
            fs.unlinkSync(downloadPath);
            api.unsendMessage(processingMessage.messageID);
          },
          event.messageID
        );

      } catch (downloadError) {
        console.error("Error during download:", downloadError);
        api.sendMessage(`Failed to download the MP3: ${downloadError.message}`, event.threadID, event.messageID);
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        if (fs.existsSync(downloadPath)) {
          fs.unlinkSync(downloadPath);
        }
      }

    } catch (error) {
      console.error(`Failed to process the song: ${error.message}`);
      api.sendMessage(`Failed to process the song: ${error.message}`, event.threadID, event.messageID);
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.unsendMessage(processingMessage.messageID);
    }
  },
};
