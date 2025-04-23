Module.exports.config = {
  name: "mention",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Rudra",
  description: "Track a user and automatically mention them when they message.",
  commandCategory: "group",
  usages: "mention @user | stopmention | startmention",
  cooldowns: 5
};

let mentionStatus = true;
let mentionedUsers = new Set();

module.exports.run = async function({ api, event, Users, permission }) {
  const { threadID, senderID, mentions, body } = event;

  // Only allow admin to use start/stop
  if (["stopmention", "startmention"].includes(body.toLowerCase()) && permission !== 2) {
    return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
  }

  // Handle OFF
  if (body.toLowerCase() === "stopmention") {
    mentionStatus = false;
    mentionedUsers.clear();
    return api.sendMessage("Mention system OFF ho gaya hai.", threadID);
  }

  // Handle ON
  if (body.toLowerCase() === "startmention") {
    mentionStatus = true;
    return api.sendMessage("Mention system ON ho gaya hai.", threadID);
  }

  // Add new user to track
  if (mentionStatus && mentions && Object.keys(mentions).length > 0) {
    const mentionID = Object.keys(mentions)[0];
    const mentionName = mentions[mentionID].replace("@", "");
    mentionedUsers.add(mentionID);

    return api.sendMessage({
      body: `${mentionName}, oye.`,
      mentions: [{ id: mentionID, tag: mentionName }]
    }, threadID);
  }
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID, senderID } = event;

  if (mentionStatus && mentionedUsers.has(senderID)) {
    return api.sendMessage({
      body: `Lo firse aagaye ${senderID}!`,
      mentions: [{ id: senderID, tag: "@" }]
    }, threadID);
  }
};
