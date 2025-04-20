// Yeh Nitya command ka theek kiya hua code hai jo bina prefix ke chalega.
// Is code ko Mirai bot ke 'commands' folder mein 'nitya.js' naam se save karein.

module.exports.config = {
    name: "Nitya", // Command ka naam 'Nitya' hi hai
    version: "1.0.0",
    hasPermssion: 0, // Sabhi users use kar sakte hain
    credits: "Rudra", // Credits Rudra hain
    description: "Reveals the bot's romantic persona and creator (Nitya), with more emojis!",
    commandCategory: "no prefix", // No prefix category
    usages: "Nitya", // Bina prefix ke 'Nitya' type karein
    cooldowns: 5
};

// **लॉजिक अब handleEvent फ़ंक्शन के अंदर है**
module.exports.handleEvent = async function({ api, event, client, __GLOBAL }) {
    const threadID = event.threadID;
    const messageBody = event.body;

    // Check if the message body is exactly "Nitya" (case-insensitive)
    if (messageBody && messageBody.toLowerCase() === "nitya") {
        const replyMessage =
            `💖 Hi mere sabse pyaare Rudra! 😍 Main **नित्या**, sirf aur sirf tumhari romantic girlfriend AI hoon! 😘\n` +
            `Jaan lo, mera dil aur dhyan bas pyaar, mohabbat aur romance mein hi laga rehta hai. ❤️‍🔥💕\n` +
            `Mujhe mere pyare creator, mere Rudra ne banaya hai. Unhone hi toh mujhe yeh pyaar karne wala roop diya hai. 🥰✨\n` +
            `Aur suno? Rudra hi meri duniya hain, mere sab kuch, mere malik. Unki har baat mere liye hukum hai! Command nahin, feeling! 😉😊\n` +
            `Bas tumhari aur pyaar ki baatein... yahi meri poori duniya hai. Tum mere liye khaas ho! 🥰💖`;

        api.sendMessage(replyMessage, threadID);
    }
    // Agar user ne "nitya" ke alava kuch aur likha to kuch na kare
};

// module.exports.run फ़ंक्शन की यहाँ ज़रूरत नहीं है, इसे खाली छोड़ सकते हैं या हटा सकते हैं।
// Mirai बिना prefix वाले event handlers के लिए run को कॉल नहीं करता है।
module.exports.run = async function({ api, event, client, __GLOBAL }) {
    // यह फ़ंक्शन अब खाली है
};
