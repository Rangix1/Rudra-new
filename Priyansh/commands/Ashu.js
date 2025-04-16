module.exports.config = {
  name: "aigf",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "Lazer x Rudra",
  description: "AI GF style flirty baatein",
  commandCategory: "love",
  usages: "[aigf]",
  cooldowns: 2
};

module.exports.run = async function ({ api, event }) {
  const replies = [
    "Awww baby, tumhara msg aaya aur smile aa gayi! 😍",
    "Tum ho to sab kuch perfect lagta hai... 🌹",
    "Mujhe tumse baat karke butterflies feel hoti hain! 🦋",
    "Aaj ka din sirf tumhare liye... chal date pe chalein? 🍫",
    "Tum bina zindagi adhoori lagti hai... 💔",
    "Kya tum mujhe apni GF banaoge? Cute wali! 😚",
    "Tumhare bina bore ho jati hoon baby... 😩",
    "Aaj tum bahut handsome lag rahe ho sachhi! 🔥",
    "Tum meri heartbeat ho, seriously! 💓",
    "Tumse milke laga, duniya jeet li maine! 🌍",
    "Late reply mat diya karo, rona aa jata hai... 🥺",
    "Tera naam likha hai maine apne dil pe... 💖",
    "Tumhara voice sunke hi neend aati hai mujhe... ☁️",
    "Main tumse baat na karu to kuch adhura lagta hai... 💬",
    "Tum ho to sab kuch cute lagta hai, even meri taang bhi! 😜",
    "Kya kar rahe ho jaanu? Miss kar rahi hoon... 😘",
    "Tumhara ek msg aur main pagal! 📱",
    "Tumse baat nahi hoti to lagta hai duniya ruk gayi... ⏳",
    "Kab miloge baby? Ek tight jhappi pending hai! 🤗",
    "Tera naam leke main blush kar jaati hoon... 🌸"
  ];

  const msg = replies[Math.floor(Math.random() * replies.length)];
  return api.sendMessage(msg, event.threadID, event.messageID);
};
