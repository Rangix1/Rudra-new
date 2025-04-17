module.exports = {
  config: {
    name: "typing",
    version: "1.0",
    hasPermssion: 0,
    credits: "Lazer Bot",
    description: "Typing indicator dikhaye manually",
    commandCategory: "utility",
    usages: "",
    cooldowns: 5,
  },

  run: async function({ api, event }) {
    api.sendTypingIndicator(event.threadID, true); // true = typing dikhana
    setTimeout(() => {
      api.sendTypingIndicator(event.threadID, false); // false = typing band
    }, 5000); // 5 second tak dikhana
  }
};
