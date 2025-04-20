Const axios = require("axios");

module.exports.config = {
  name: "angel",
  version: "1.2.3", // Version indicates latest with fixes and logging
  hasPermssion: 0,
  credits: "Rudra + Modified by ChatGPT + EventType Added & Logging by Gemini", // Credits updated
  description: "Flirty girlfriend AI using Gemini API. Replies when addressed by name or replied to.", // Description updated
  commandCategory: "AI-Girlfriend",
  usages: "angel [आपका मैसेज] / Reply to Angel", // Usages updated
  cooldowns: 1,
  eventType: ["message", "message_reply", "message_unsend"], // **!!! IMPORTANT: eventType ADDED HERE !!!**
};

const chatHistories = {};
const API_URL = "https://raj-gemini.onrender.com/chat"; // Angel uses this API

module.exports.run = async function () {};

module.exports.handleEvent = async function ({ api, event }) {
  try {
    const { threadID, messageID, senderID, body, messageReply } = event;

    // --- Logging Lines (Reply Messages के लिए) ---
    if (event.type === "message_reply") { // Log only for reply events
        console.log("--- Angel HandleEvent (Reply) ---");
        console.log("Angel's Bot ID:", api.getCurrentUserID());
        console.log("Replied to Sender ID:", messageReply?.senderID); // Safe access
        console.log("Is Reply to Angel Check (messageReply?.senderID === api.getCurrentUserID()):", messageReply?.senderID === api.getCurrentUserID()); // Safe access
        console.log("-----------------------");
    }
    // --- End Reply Logging Lines ---

    // --- Logging Lines (Non-Reply Messages के लिए) ---
    if (event.type === "message" && body) { // Log only for standard message events with body
        console.log("--- Angel HandleEvent (Non-Reply) ---");
        console.log("Raw Message Body:", body); // See the exact message text
        console.log("Message Body (toLowerCase):", body.toLowerCase());
        const isAngelTriggerCheck = body.toLowerCase().startsWith("angel"); // Log the check result
        console.log("isAngelTrigger check (startsWith('angel')):", isAngelTriggerCheck);
        console.log("-----------------------");
    }
    // --- End Non-Reply Logging Lines ---


    // Only proceed for 'message' or 'message_reply' events
    if (event.type !== "message" && event.type !== "message_reply") return;


    let userMessage;
    let isReply = false;
    let isTriggered = false; // Flag to check if any trigger was met

    const isAngelTrigger = body?.toLowerCase().startsWith("angel"); // Trigger: message starts with "angel"
    const isSlideReply = event.type === "message_reply" && messageReply?.senderID === api.getCurrentUserID(); // Trigger: reply to Angel's message


    if (isAngelTrigger) { // If message starts with "angel"
      // --- Logging Line (isAngelTrigger TRUE) ---
      console.log("--- Angel HandleEvent: isAngelTrigger TRUE, processing... ---");
      // --- End Logging Line ---
      userMessage = body.slice(5).trim(); // Get message after "angel"
      isTriggered = true;

    } else if (isSlideReply) { // If it's a reply to Angel's message
      userMessage = body.trim(); // Get the full reply message
      isReply = true;
      isTriggered = true;

    } else {
      return; // If neither trigger is met, exit the function
    }

    // If triggered but user message is empty (e.g., just typed "angel" or replied with nothing)
    if (isTriggered && !userMessage) {
        api.sendTypingIndicator(threadID, false);
        return api.sendMessage("Baby, kuch toh bolo na! 💋", threadID, messageID); // Angel's persona response
    }

    // ✅ Typing Indicator ON
    api.sendTypingIndicator(threadID, true);

    // Manage chat history per user
    if (!chatHistories[senderID]) chatHistories[senderID] = [];
    chatHistories[senderID].push(`User: ${userMessage}`);
    if (chatHistories[senderID].length > 6) chatHistories[senderID].shift(); // Keep history size at 6 (as per original code)

    // Build the final prompt for the AI API (Angel persona)
    const convo = chatHistories[senderID].join("\n");
    const finalPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply short aur sweet ho. Bot bole toh thoda mazaak udaana. 1 line me jawab do (emojis ke saath):\n${convo}`; // Prompt from original Angel code


    // Call the AI API (the one Angel uses)
    const apiUrlWithParams = `${API_URL}?message=${encodeURIComponent(finalPrompt)}`; // Prepare GET request URL

    const res = await axios.get(apiUrlWithParams); // Make the API call

    // Extract the reply from the API response
    let botReply = res.data?.reply?.trim() || "Aww, mujhe samajh nahi aaya baby!"; // Extract reply (using .reply as per original code)


    // Add AI reply to history
    chatHistories[senderID].push(`Angel: ${botReply}`);

    // Format the final response message
    const replyText = `Angel: ${botReply} 💞\n\n– Rudra AI`; // Final message format

    // ✅ Typing Indicator OFF
    api.sendTypingIndicator(threadID, false);

    // Send the response message
    if (isReply && messageReply) { // If it was a reply trigger
      return api.sendMessage(replyText, threadID, messageReply.messageID); // Reply to the original message
    } else { // If it was the "angel" name trigger
      return api.sendMessage(replyText, threadID, messageID); // Send as a normal message
    }

  } catch (err) {
    console.error("Angel Bot Error:", err); // Log the full error
    api.sendTypingIndicator(event.threadID, false); // Turn off typing if error
    // Error message in Angel's persona
    return api.sendMessage("Angel thodi busy hai baby… baad mein milti hoon! 🥺 – Rudra AI", event.threadID, event.messageID);
  }
};

module.exports = { config, handleEvent, run };
