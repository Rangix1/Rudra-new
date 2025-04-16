const autotagMap = new Map();

module.exports.config = {
  name: "autotag",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Lazer Mohit",
  description: "Auto mention selected user on every message",
  commandCategory: "group",
  usages: "@mention to start/stop autotag",
  cooldowns: 5
};

module.exports.run = async function({ api, event }) {
  const mention = Object.keys(event.mentions)[0];
  if (!mention) return api.sendMessage("Kisi ko mention to karo bhai.", event.threadID);

  if (autotagMap.has(event.threadID)) {
    autotagMap.delete(event.threadID);
    return api.sendMessage("Auto mention band kar diya gaya.", event.threadID);
  } else {
    autotagMap.set(event.threadID, mention);
    return api.sendMessage(`Auto tag chalu hogaya for: ${event.mentions[mention]}`, event.threadID);
  }
};

module.exports.handleEvent = async function({ api, event }) {
  if (!event.body || !autotagMap.has(event.threadID)) return;

  const userID = autotagMap.get(event.threadID);
  if (event.senderID == userID) return; // Apne aap ko spam na kare

  const name = (await api.getUserInfo(userID))[userID].name;

  api.sendMessage({
    body: `Message received! ${name}, sunle zara!`,
    mentions: [{
      tag: name,
      id: userID
    }]
  }, event.threadID);
};

module.exports.handleReply = async function () {};
