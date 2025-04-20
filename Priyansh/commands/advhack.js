module.exports.config = {
  name: "advhack",
  version: "1.0",
  hasPermssion: 0,
  credits: "Mohit x Rudra",
  description: "Mention pe hacking animation",
  commandCategory: "fun",
  usages: "@user",
  cooldowns: 3,
};

const adminUID = "61550558518720";
const hackingAnimations = [
  "[▯▯▯▯▯▯▯▯▯▯] Initiating system breach...",
  "[████░░░░░░░░░] 25% Bypassing firewall...",
  "[████████░░░░] 60% Extracting login tokens...",
  "[██████████░░] 80% Accessing mainframe...",
  "[████████████] 100% Target access granted!",
  "Injecting remote shell...",
  "Downloading chats.db, images.zip...",
  "Uploading virus.exe to target device...",
  "Fetching IP logs... done!",
  "LOGOUT command injected!",
];

module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  if (senderID !== adminUID) return api.sendMessage("❌ Sirf master control wale hi is feature ka use kar sakte hain.", threadID, messageID);
  if (Object.keys(mentions).length === 0) return api.sendMessage("⚠️ Mention karo kisko hack dikhana hai!", threadID, messageID);

  const targetName = Object.values(mentions)[0];
  const targetUID = Object.keys(mentions)[0];

  api.sendMessage(`⚠️ Hack mode activated for ${targetName}\n5 minutes simulation started...`, threadID, messageID);

  let count = 0;
  const interval = setInterval(() => {
    const msg = hackingAnimations[Math.floor(Math.random() * hackingAnimations.length)];
    api.sendMessage(`Target: ${targetName}\n${msg}`, threadID);
    count++;
    if (count >= 30) clearInterval(interval); // 30 messages = ~5 minutes
  }, 10000); // Every 10 seconds
};
