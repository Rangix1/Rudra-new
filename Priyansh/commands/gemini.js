const fetch = require("node-fetch");

module.exports = {
  config: {
    name: "gemini",
    version: "1.0",
    author: "Mohit",
    role: 0,
    shortDescription: "Ask anything from Gemini AI",
    longDescription: "Interact with Google Gemini Pro API",
    category: "ai",
    guide: "{p}gemini <your question>"
  },

  onStart: async function ({ message, event, args }) {
    const apiKey = "AIzaSyDm_hIMUWW_ZcDQCUUlpn7IEWBBuGtJMIw"; // Your Gemini API Key
    const prompt = args.join(" ");

    if (!prompt) {
      return message.reply("Bhai kuch likh to sahi! Example: gemini Hello ka matlab?");
    }

    const body = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body)
        }
      );

      const data = await res.json();

      const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini se koi reply nahi aaya.";
      message.reply(replyText);
    } catch (err) {
      console.error("Gemini Error:", err);
      message.reply("Error aagayi Gemini se baat karte hue.");
    }
  }
};
