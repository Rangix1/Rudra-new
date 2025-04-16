module.exports.config = {
    name: "mention",
    version: "1.1.0",
    hasPermssion: 2, // Required permission level (group admins)
    credits: "Rudra",
    description: "Track users and automatically mention them when they message. Can toggle mentions on/off.",
    commandCategory: "group",
    usages: "mention @user | stopmention",
    cooldowns: 10
};

const mentionedUsers = new Set(); // Set to track mentioned users
let mentionStatus = true; // Flag to toggle mention on/off

module.exports.run = async function({ api, event, threadID }) {
    const { senderID, body, mentions } = event;

    // Command to toggle mention on/off
    if (body.toLowerCase() === "stopmention") {
        mentionStatus = false;
        api.sendMessage("Mention tracking has been turned off. No more automatic mentions.", threadID);
        return;
    }
    
    if (body.toLowerCase() === "startmention") {
        mentionStatus = true;
        api.sendMessage("Mention tracking has been turned back on. I will mention tracked users.", threadID);
        return;
    }

    // Check if the message contains a mention
    let mention = Object.keys(mentions)[0];

    // If a mention exists, add the user to the mentionedUsers set
    if (mention && mentionStatus) {
        mentionedUsers.add(mention);
        api.sendMessage(`@${mentions[mention].replace('@', '')}, aap ab track ho gaye hain! Jab aap message bhejenge, main aapko automatically mention karunga.`, threadID);
    }

    // If the sender is in the mentionedUsers set and mentionStatus is true, mention them
    if (mentionedUsers.has(senderID) && mentionStatus) {
        api.sendMessage(`@${senderID}, aapko pehle mention kiya gaya tha!`, threadID);
    }
};
