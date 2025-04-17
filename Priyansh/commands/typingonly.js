module.exports = {
  config: {
    name: "typingonly",
    version: "1.0.0",
    permission: 0,
    credits: "Lazer x GPT",
    description: "Bas typing indicator dikhaye jab message aaye",
    commandCategory: "No prefix",
    usages: "",
    cooldowns: 1,
  },

  handleEvent: async function({ api, event }) {
    const { threadID, senderID } = event;

    // Bot khud ko ignore kare
    if (senderID == api.getCurrentUserID()) return;

    // Typing dikhana
    api.sendTypingIndicator(threadID, true);
  },

  run: async function() {
    // Run function ka kaam nahi hai yaha
    return;
  }
};
