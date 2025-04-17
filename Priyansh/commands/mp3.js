const axios = require("axios");

module.exports.config = {
  name: "mp3",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Get MP3 song by name",
  commandCategory: "music",
  usages: "mp3 [song name]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const songName = args.join(" ");
  const { threadID, messageID } = event;

  if (!songName) {
    return api.sendMessage("Please enter the name of the song!\n\nExample: mp3 Tumse hi", threadID, messageID);
  }

  try {
    const res = await axios.get(`https://vihangayt.me/download/ytmp3?query=${encodeURIComponent(songName)}`);

    if (!res.data || !res.data.data || !res.data.data.url) {
      return api.sendMessage("MP3 fetch nahi hua bhai, naam ya API check karo.", threadID, messageID);
    }

    const mp3Url = res.data.data.url;

    return api.sendMessage(
      {
        body: `✅ Song found: ${songName}\n\n🎧 Download MP3:\n${mp3Url}`,
      },
      threadID,
      messageID
    );

  } catch (err) {
    console.log("MP3 Error:", err);
    return api.sendMessage("Error aayi bhai, song laate time kuch dikkat ho gayi.", threadID, messageID);
  }
};
