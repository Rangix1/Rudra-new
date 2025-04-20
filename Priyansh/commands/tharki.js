module.exports.config = {
  name: "tharki",
  version: "1.1",
  hasPermssion: 0,
  credits: "rudra",
  description: "Non-prefix tharki replies + hacker demo + gaali + UID control",
  commandCategory: "fun",
  usages: "Auto trigger",
  cooldowns: 1,
};

const tharkiMsgs = [
  "Baby tere jaise curve toh Photoshop me bhi nahi milte! 🔥",
  "Tera kamar hilta hai toh bass speaker bhi sharma jaaye! 🔊",
  "Aisi smile... dil ki toh lassi ban gayi! 💦",
  "Oye tu shake kare toh earthquake aa jaye! 🌍",
  "Tere hot lips dekhke halwai bhi jalebi banana bhool jaaye! 💋",
  "Tu paas aaye toh AC bhi hot ho jaaye! 🔥",
  "Tumhare thumke dekhke mujhe pacemaker lagwana padega! 💓",
  "Tere jaise figure ke liye toh artist bhi pencil tod de! ✏️",
  "Tu samne ho toh DJ bhi bajna sharma jaaye! 🎧",
  "Tere aankhon mein kajal nahi... pura kaala jadoo hai! 👁️",
  "Tere jaisi girl ho toh internet ka bhi crash ho jaaye! 💻",
  "Tera body dekhke dumbbell bhi feel kar le jealous! 🏋️",
  "Tu toh asli tharki queen hai – mujhe bhi training de de! 😏",
  "Kya figure hai baby, GPS bhi raasta bhool jaaye! 🗺️",
  "Tere jaise peet pe tattoo toh dil pe attack lagta hai! ⚠️",
  "Aise walk karti hai jaise ramp hi sadak ho! 🔥",
  "Tu online ho jaaye toh pura Facebook tharki ho jaaye! 😈",
  "O baby, tu toh meri dirty fantasy ban gayi hai! 💭",
  "Teri har reel se toh zindagi feel hone lagti hai! 🎬",
];

const hackerReplies = [
  "⚠️ Hacking Firewall Active: IP traced, system breach blocked.",
  "⚠️ Warning: Gaali detect hui hai, target marked for demo hack.",
  "💀 Rudra Mode Activated – Bot ko chhedne ka result milega!",
  "👁 Bot: Trace started, virtual attack ready!",
  "🔐 Hack simulation running... teri ID ab safe nahi!",
  "🤖 Tumne hacker ko chheda hai... ab bhugto!",
];

const gaaliReply = [
  "Oye chhoti soch wale, tu apni aukaat me reh! 🖕",
  "Gaali deta hai? Tere jaise toh recycle bin me hi ache lagte hain!",
  "Tere jaise logon ke liye delete button invent hua tha! 🗑️",
  "Gaali dena band kar warna bot teri gaand tape karega! 🔨",
  "Apne baap se baat karne ki tameez seekh le pehle! ☠️",
  "Gaali deke macho ban raha hai? Jaa pehle mirror dekh! 🪞",
  "Bot ko chheda? Ab tujhe system se logout milega! 🔒",
  "Chup be moorkh! Tu toh AI ke bhi blacklist me hai! 🛑",
];

// Sirf admin UID (aap)
const adminUID = "61550558518720";

module.exports.handleEvent = async function ({ api, event }) {
  const { threadID, senderID, body } = event;
  if (!body) return;

  const lower = body.toLowerCase();

  // Hack trigger (only by admin)
  if (senderID === adminUID && lower.includes("hack kr") && lower.includes("id")) {
    return api.sendMessage(
      "⚠️ Hack simulation started for target ID...\n[████░░░░░░░░░░] 25%\nSystem breach in process...\n[██████████░░░░] 80%\nDemo complete. Hack activated (start).",
      threadID
    );
  }

  // Gaali + rudra/bot check
  const gaaliList = ["chutiya", "gandu", "bhosdike", "madarchod", "teri ma ki", "Gandu", "bc", "mc"];
  const mentionedBot = lower.includes("bot") || lower.includes("rudra");
  const saidGaali = gaaliList.some((word) => lower.includes(word));

  if (saidGaali && mentionedBot) {
    const gali = gaaliReply[Math.floor(Math.random() * gaaliReply.length)];
    const hack = hackerReplies[Math.floor(Math.random() * hackerReplies.length)];
    return api.sendMessage(`${gali}\n\n${hack}`, threadID);
  }

  // Tharki reply only when "tharki" word is said
  if (lower.includes("tharki")) {
    const reply = tharkiMsgs[Math.floor(Math.random() * tharkiMsgs.length)];
    return api.sendMessage(reply, threadID);
  }
};

module.exports.run = () => {};
