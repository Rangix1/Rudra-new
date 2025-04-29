const axios = require('axios');

module.exports = {
  // Mirai Command Configuration
  config: {
    name: "gemini", // Command name
    aliases: ['ai', 'Ai', 'Gemini', 'AI'], // Alternative names
    version: 2.0, // Version of the command
    author: "OtinXSandip", // Author(s)
    description: "Interact with Gemini AI", // Short description
    role: 0, // Minimum user role required (0 for everyone)
    category: "ai", // Command category
    usages: "{pn} <Query> or reply to a photo with <Query>", // How to use the command
    cooldown: 5, // Cooldown in seconds per user (optional but recommended)
    credits: "OtinXSandip", // Credits for the API/command logic
    // guide is not a standard Mirai config property, usages is used instead
  },

  // Main function to execute when the command is called
  run: async function ({ api, event, args, Users, Threads }) {
    const { senderID, threadID, messageID } = event; // Destructure event properties

    try {
      // Get user data for mention
      const userData = await Users.getData(senderID);
      const userName = userData.name || "User"; // Get user name, default if not found

      // Mirai mention format: array of objects
      const mention = [{ tag: userName, id: senderID }];

      let prompt = args.join(" "); // Get the text prompt from arguments
      let imageUrl = null; // Variable to store image URL if replying to a photo

      // Check if the message is a reply to a photo
      if (event.messageReply && event.messageReply.attachments && event.messageReply.attachments[0].type === "photo") {
        imageUrl = encodeURIComponent(event.messageReply.attachments[0].url);
        // If prompt is empty when replying to a photo, provide a default
        if (!prompt) {
             prompt = "Describe this image.";
        }
      } else if (!prompt) {
          // If no prompt and not replying to a photo, ask the user for input
          return api.sendMessage("Please provide a query or reply to a photo.", threadID, messageID);
      }

      api.setMessageReaction("⏳", messageID); // Set thinking reaction on the user's message

      let apiUrl;
      if (imageUrl) {
        // Use the API endpoint for image + text
        apiUrl = `https://sandipbaruwal.onrender.com/gemini2?prompt=${encodeURIComponent(prompt)}&url=${imageUrl}`;
      } else {
        // Use the API endpoint for text only
        apiUrl = `https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`;
      }

      // Make the API call
      const response = await axios.get(apiUrl);
      const result = response.data.answer;

      api.setMessageReaction("✅", messageID); // Set success reaction on the user's message

      // Construct the message body with mention
      const messageBody = `${userName}, ${result}`;

      // Send the response message
      api.sendMessage({
        body: messageBody,
        mentions: mention, // Include mention in the message object
      }, threadID, (err, info) => {
        // Callback after sending the message to set up reply handling
        if (!err) {
          // Register a reply handler for the message sent by the bot
          // This allows the bot to listen for replies to its own message
          global.client.handleReply.set(info.messageID, {
            name: this.config.name, // Command name
            messageID: info.messageID, // ID of the bot's message to listen for replies
            author: senderID, // ID of the original command invoker (for security/context)
            type: "gemini_reply" // Custom type to identify this handler (optional)
          });
        } else {
          console.error("Error sending message:", err);
        }
      }, messageID); // Reply directly to the user's command message

    } catch (error) {
      console.error("Error in Gemini command:", error);
      api.setMessageReaction("❌", messageID); // Set error reaction on the user's message
      api.sendMessage("An error occurred while processing your request.", threadID, messageID);
    }
  },

  // Function to handle replies to the bot's message
  handleReply: async function ({ api, event, handleReply, args, Users }) {
     const { senderID, threadID, messageID } = event;

     // Check if the reply is from the user who started the conversation
     if (handleReply.author != senderID) return;

     try {
       const userData = await Users.getData(senderID);
       const userName = userData.name || "User";
       const mention = [{ tag: userName, id: senderID }];

       const prompt = args.join(" "); // The user's reply text is the new prompt

       if (!prompt) {
         return api.sendMessage("Please provide a query.", threadID, messageID);
       }

       api.setMessageReaction("⏳", messageID); // Set thinking reaction on the user's reply message

       // Use the text-only API for subsequent replies in the conversation flow
       const apiUrl = `https://sandipbaruwal.onrender.com/gemini?prompt=${encodeURIComponent(prompt)}`;

       // Make the API call
       const response = await axios.get(apiUrl);
       const result = response.data.answer;

       api.setMessageReaction("✅", messageID); // Set success reaction on the user's reply message

       const messageBody = `${userName}, ${result}`;

       // Send the response message and update the reply handler
       api.sendMessage({
         body: messageBody,
         mentions: mention,
       }, threadID, (err, info) => {
         if (!err) {
            // Update the reply handler to listen to the *new* message the bot just sent
            global.client.handleReply.set(info.messageID, {
               name: this.config.name,
               messageID: info.messageID, // New bot message ID for the next reply
               author: senderID,
               type: "gemini_reply"
            });
            // Optionally, delete the old reply handler if you only want one active chain
            global.client.handleReply.delete(handleReply.messageID);
         } else {
           console.error("Error sending reply message:", err);
         }
       }, messageID); // Reply directly to the user's reply message

     } catch (error) {
       console.error("Error in Gemini reply handler:", error);
       api.setMessageReaction("❌", event.messageID); // Set error reaction on the user's reply
       api.sendMessage("An error occurred while processing your reply.", threadID, event.messageID);
     }
  }
};
