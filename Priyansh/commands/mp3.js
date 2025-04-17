const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "mp3",
  version: "1.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Download MP3 song by name",
  commandCategory: "media",
  usages: "[song name]",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  const song = args.join(" ");
  if (!song) return api.sendMessage("Bhai song ka naam toh de!", event.threadID, event.messageID);

  try {
    const res = await axios.get(`https://api.guruapi.tech/api/dlsong?name=${encodeURIComponent(song)}`);
    const url = res.data.url;
    if (!url) return api.sendMessage("MP3 fetch nahi hua bhai, naam check karo.", event.threadID, event.messageID);

    const mp3Path = path.join(__dirname, "cache", `song.mp3`);
    const writer = fs.createWriteStream(mp3Path);

    const response = await axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    writer.on("finish", () => {
      api.sendMessage(
        {
          body: `Lo bhai tumhara gaana: ${song}`,
          attachment: fs.createReadStream(mp3Path),
        },
        event.threadID,
        () => fs.unlinkSync(mp3Path),
        event.messageID
      );
    });

    writer.on("error", () => {
      api.sendMessage("Download mein error aaya bhai.", event.threadID, event.messageID);
    });
  } catch (err) {
    console.log(err);
    api.sendMessage("Error aa gaya bhai, ya toh song nahi mila ya API down hai.", event.threadID, event.messageID);
  }
};
