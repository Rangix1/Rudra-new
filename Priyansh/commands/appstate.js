Const fs = require("fs-extra");

module.exports.config = {
  name: "appstate",
  version: "1.0.1", // Version updated for changes
  hasPermssion: 2, // Admin permission level
  credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 + Code Cleaned by Gemini", // Added credit for cleaning
  description: "Refreshes appstate.json with the current session state.", // Clearer description
  commandCategory: "Admin",
  usages: "appstate",
  cooldowns: 5,
  dependencies: {
      "fs-extra": "" // Declare fs-extra dependency
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;

  // *** REMOVED HARDCODED PERMISSION CHECK ***
  // Relying on hasPermssion: 2 defined in module.exports.config
  // The framework will handle permission check before running this function

  let appstate;
  try {
      appstate = api.getAppState();
      if (!appstate) {
          return api.sendMessage("Could not get current app state. Bot might not be logged in properly.", threadID, messageID);
      }
  } catch (e) {
      return api.sendMessage(`Error getting app state: ${e.message}`, threadID, messageID);
  }

  // Define the path to appstate.json relative to the bot's main folder
  // Assumes this module is in /Priyansh/commands/
  const appstatePath = `${__dirname}/../../appstate.json`;

  // Convert JSON object to a string with 2-space indentation for readability
  const data = JSON.stringify(appstate, null, 2);

  // Write file to disk asynchronously
  fs.writeFile(appstatePath, data, 'utf8', (err) => {
    if (err) {
      console.error("Error writing appstate.json:", err); // Log error on server
      return api.sendMessage(`❌ Error writing appstate.json: ${err.message}`, threadID, messageID); // Send error message to chat
    } else {
      return api.sendMessage("✅ Refreshed appstate.json successfully. Login stability improved! ✨", threadID, messageID); // Send success message
    }
  });
};
