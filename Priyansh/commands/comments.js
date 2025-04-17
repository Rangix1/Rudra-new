const axios = require("axios");

module.exports.config = {
  name: "comments",
  version: "1.0.1",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Bot comments on posts and sends a message to your UID.",
  commandCategory: "Automation",
  usages: "no prefix",
  cooldowns: 5,
};

module.exports.handleEvent = async function ({ api, event, Users }) {
  try {
    var { threadID, messageID, body } = event;
    
    // Set your UID here
    var myUID = "61550558518720"; // Replace with your actual UID

    var userID = event.senderID; // Get the user ID
    var userName = await Users.getNameUser(userID); // Get the username of the person

    // Check if the message contains "Osm pic"
    if (body.toLowerCase().includes("osm pic")) {
      var postLink = event.threadID; // Get the post ID (can be modified depending on the data structure)
      
      // Send a comment
      var commentMessage = `✨ Wow! Your pic is just Osm. 🔥🔥`;
      api.sendMessage({ body: commentMessage }, threadID, messageID);
      
      // Check if the sender is your UID
      if (userID == myUID) {
        // Send a confirmation message to your UID
        var confirmationMessage = `Hey ${userName}, I commented on your post: "${commentMessage}". Keep shining! ✨`;

        // Send message to your UID
        return api.sendMessage(confirmationMessage, myUID); // This will send the message only to your UID
      }
    }

  } catch (err) {
    console.error("Error in comments bot:", err);
  }
};

module.exports.run = function () {
  // The run method can be left empty if it's just for handling events
};
