module.exports.config = {
  name: "mention",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Rudra",
  description: "Track a user and automatically mention them when they message.",
  commandCategory: "group",
  usages: "mention @user | stopmention | startmention",
  cooldowns: 5
};

let mentionStatus = true; // Mention system ON by default
let mentionedUsers = new Set(); // Store tracked user IDs

module.exports.run = async function({ api, event }) {
  const { threadID, senderID, mentions, body } = event;

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
      body: `${mentionName}, ab jab bhi tum message bhejoge toh bot tumhe mention karega.`,
      mentions: [{ id: mentionID, tag: mentionName }]
    }, threadID);
  }
};

// Listen to all messages and auto-mention
module.exports.handleEvent = async function({ api, event }) {
  const { threadID, senderID } = event;

  if (mentionStatus && mentionedUsers.has(senderID)) {
    return api.sendMessage({
      body: `Lo firse aagaye ${senderID}!`,
      mentions: [{ id: senderID, tag: "@" }]
    }, threadID);
  }
};
