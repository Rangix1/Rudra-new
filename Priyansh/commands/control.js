const fs = require("fs");
const path = require("path");
const statusPath = path.join(__dirname, "..", "botStatus.json");

module.exports = {
  config: {
    name: "bot",
    aliases: [],
    version: "1.0",
    author: "Lazer DJ",
    countDown: 0,
    role: 0,
    shortDescription: "Bot on/off",
    longDescription: "Turn bot on or off via command",
    category: "system",
    guide: "{pn} on | off"
  },

  onStart: async function ({ message, args }) {
    if (!["on", "off"].includes(args[0])) {
      return message.reply("Sahi usage: /bot on ya /bot off likho");
    }

    const newStatus = args[0] === "on";
    fs.writeFileSync(statusPath, JSON.stringify({ status: newStatus }, null, 2));
    message.reply(`Bot ab "${newStatus ? "ON" : "OFF"}" mode me hai.`);
  }
};
