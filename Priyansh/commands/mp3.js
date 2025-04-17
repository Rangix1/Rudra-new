const axios = require("axios");

module.exports.config = {
  name: "mp3",
  version: "1.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Search and send MP3 from YMusic",
  commandCategory: "music",
  usages: "[song name]",
  cooldowns: 2
};

module.exports.run = async function({ api, event, args }) {
  const songName = args.join(" ");
  if (!songName) return api.sendMessage("Gaane ka naam to do bhai!", event.threadID, event.messageID);

  try {
    const res = await axios.get(`https://melodyapi.000webhostapp.com/api/ymusic?search=${encodeURIComponent(songName)}`);
    const data = res.data;

    if (!data || !data.title || !data.url) {
      return api.sendMessage("Song nahi mila bhai, thoda aur clear naam do.", event.threadID, event.messageID);
    }

    const msg = {
      body: `🎵 *${data.title}*\n\nGaana mil gaya bhai, le suno!`,
      attachment: await global.utils.getStreamFromURL(data.url)
    };

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("Error aayi bhai, song laate time kuch dikkat ho gayi.", event.threadID, event.messageID);
  }
};
