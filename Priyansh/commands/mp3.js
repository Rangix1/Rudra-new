const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "mp3",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Download & send MP3 from URL/API",
  commandCategory: "media",
  usages: "mp3 [query or leave blank]",
  cooldowns: 2,
};

module.exports.run = async function ({ api, event, args }) {
  const query = args.join(" ") || "lofi music"; // default search
  const url = `https://api-vo7p.onrender.com/mp3?search=${encodeURIComponent(query)}`;

  const tempPath = path.join(__dirname, `temp_${event.senderID}.mp3`);

  try {
    const res = await axios({
      method: "GET",
      url: url,
      responseType: "stream"
    });

    const writer = fs.createWriteStream(tempPath);
    res.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage({
        body: `Lo bhai tumhara gaana: ${query} – Rudra AI`,
        attachment: fs.createReadStream(tempPath)
      }, event.threadID, () => fs.unlinkSync(tempPath));
    });

    writer.on("error", () => {
      api.sendMessage("File download mein error aayi bhai!", event.threadID);
    });

  } catch (err) {
    console.log(err);
    return api.sendMessage("MP3 fetch nahi hua bhai, API ya naam check karo.", event.threadID);
  }
};
