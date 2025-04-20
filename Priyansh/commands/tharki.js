module.exports.config = {
  name: "tharki",
  version: "1.0",
  hasPermssion: 0,
  credits: "Rudra",
  description: "Pure tharki messages with hacker vibe & gender detect",
  commandCategory: "fun",
  usages: "tharki",
  cooldowns: 3
};

const maleMsgs = [
  "Oye baby, tera kamar ka curve mujhe nidra bhoolwa de! 🔥",
  "Tera kajal dekhke toh aag lag jaati hai yaar! 🔥🔥",
  "Aaj mausam thoda tharka hai, aur tu full jalwa hai! 😎💥",
  "Baby tu hile toh dil hilta hai! 💃🔥",
  "Tere hot lips dekhke dil chummi chummi bolta hai! 💋🔥",
  "Raat bhar tujhe story me dekhta raha, ab toh sapne me aaja! 🌙💭",
  "Tera dupatta udaa toh dil bhi udaa! 😍🪁",
  "Tu samajhti kya hai apne aap ko, meri future wife hai tu! 😏💍",
  "Tumhare thumke toh 808 bass se bhi heavy lagte hain! 💣🎶",
  "Bheegti baarish me tu sabse hot lagti hai baby! 🌧️🔥",
  "Tu saamne ho toh DJ bhi bajna sharma jaaye! 🎧💥",
  "Teri kamar pe tattoo hai ya talwar? Dil cheer diya re! 💘⚔️",
  "Aisi smile maar di baby ne ki pura tharki mode on ho gaya! 😁🎶",
  "Teri aankhon mein dooba hoon, sanson ka kya hoga? 😍💖",
  "Kya lagti ho yaar, chha gyi social media pe! 😏📸",
  "Tumhari body dekhke gym ka plan cancel kar diya! 💪🔥",
  "Baby tu online ho ja, mera heartbeat 2x ho jaata hai! ❤️💓",
  "Teri DP dekhke lagta hai... dard-e-dil mehnat se paaya! 📸💔",
  "Pallu sambhal baby... dil gaya fisaal! ❤️🎀",
  "Aise na dekha karo, warna ghar aane ka mann karega! 😘🏠",
  "Rudra"
];

const femaleMsgs = [
  "Bhai tu toh real life ka Sunny bhaiya nikla! 😎🔥",
  "Tera jawline dekhke toh dil halchal ho gaya! 😍💥",
  "Oye hero, shirt utaar… AC bandh kar diya! 🧑‍⚖️🔥",
  "Tharki bhai spotted with maximum swag! 😏😎",
  "Teri smile toh mujhe pregnancy test lene pe majboor kar de! 😂🔥",
  "Aise mat hans bhai, control nahi hota! 😏💃",
  "Tera body dekhke protein shake pe shak ho gaya! 💪😜",
  "Aise gym jaake kya karega... mere sapno me aaja! 😘💭",
  "Tharki vibe full ON, tu toh certified lover boy hai! 😏❤️",
  "O bhai, tu reel banata hai ya ladkiyon ke sapne? 💭📸",
  "Tera perfume bhi tharki lagta hai! 🌹🔥",
  "Jab tu aata hai na, pura Facebook tharki ho jaata hai! 😏💻",
  "Tera hairstyle dekhke toh pyar ho gaya! 💇‍♂️🔥",
  "Tu toh itna hot hai, heater off kar diya maine! 🔥🔥",
  "Tharki bhai, tere bina toh raat adhuri lagti hai! 🌙🔥",
  "Teri aankhon me kajal nahi, blackhole hai – kheenchta hai! 👀🖤",
  "Tu smile kare toh emoji bhi sharma jaaye! 😏✨",
  "Kya line marta hai bhai, training de! 💬🔥",
  "Tera swag toh bijli se tez hai! ⚡💥",
  "Tu aaye toh notification bhi hot ho jaaye! 📲🔥",
  "Rudra"
];

const hackerReplies = [
  "⚠️ Accessing mainframe... IP locked! Location tracking started! 🌐",
  "💀 Warning: Rudra Bot Firewall Activated. Tumhara system 60 sec me lockdown ho sakta hai!",
  "👁‍🗨 Bot pe gaali? System breach attempt detected. Trace back initiated...",
  "🤖 Tumne Rudra ko chhed diya... Ab cyber kaand hoga!",
  "🧠 Bot pe baat seedhe hacker mode me jaati hai! Control your tongue!",
  "👨‍💻 Bot: Target locked. System booting for virtual slap.exe!"
];

module.exports.run = async function({ api, event, Users }) {
  const { senderID, threadID, messageID, body } = event;
  const lowerMsg = body.toLowerCase();
  const userInfo = await Users.getData(senderID);
  const gender = userInfo?.gender || "male";

  // Check for "hack krle" type commands
  if (lowerMsg.includes("hack krle") || lowerMsg.includes("hack karde")) {
    return api.sendMessage("💻 Target selected.\nHacking started...\n[████░░░░░░░░░░] 20%\nPlease wait while Rudra bot accesses their facebook account...", threadID, messageID);
  }

  // Check if gaali + "bot" or "rudra" present
  const galiyaan = ["kutta", "kamina", "bhosd", "mc", "bc", "madarchod", "chutiya", "gandu", "bewkoof", "pagal"];
  const isGali = galiyaan.some(word => lowerMsg.includes(word));
  const mentionsBot = lowerMsg.includes("rudra") || lowerMsg.includes("bot");

  if (isGali && mentionsBot) {
    const hackerMsg = hackerReplies[Math.floor(Math.random() * hackerReplies.length)];
    return api.sendMessage(hackerMsg, threadID, messageID);
  }

  // Normal tharki response
  const msgList = gender === "female" ? femaleMsgs : maleMsgs;
  const randomMsg = msgList[Math.floor(Math.random() * msgList.length)];
  return api.sendMessage(randomMsg, threadID, messageID);
};
