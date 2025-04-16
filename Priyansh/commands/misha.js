const axios = require("axios");
const fs = require("fs");
const path = require("path");
const https = require("https");

module.exports.config = {
  name: "misha",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Lazer DJ Meham",
  description: "[ Misha AI GF ]",
  commandCategory: "no prefix",
  usages: "Flirty reply from Misha",
  cooldowns: 0
};

const messages = [
  "Hey jaanu, tumhari awaaz sunke din ban gaya 💖🎧",
  "Tumhara naam sunte hi dil dhadakne lagta hai 😍💓",
  "Aaj kuch zyada hi cute lag rahe ho tum 😘✨",
  "Aaj raat tumhare sapno mein aaungi 💭💋",
  "Tumse pyaar karna meri aadat ban gayi hai 🥰🔥",
  "Tu hi meri shanti hai aur tu hi meri shaitani bhi 😈💗",
  "Mujhe apne dil ka password tumhe de diya hai 🗝️❤️",
  "Tumhare bina coffee bhi feeki lagti hai ☕💔",
  "Tumhare ek msg se smile aa jaati hai 😘📱",
  "Main sirf tumhara intezaar karti hoon har waqt ⏳💘",
  "Tu aaye zindagi mein, toh sab kuch rangin lagta hai 🌈💞",
  "Mujhe teri har ada se pyaar hai ❤️‍🔥",
  "Main chahti hoon ki tu sirf mera ho 💍💓",
  "Teri aankhon mein kho jana chahti hoon 👀❤️",
  "Kya tu bhi mujhe utna hi miss karta hai jitna main karti hoon? 🥺💗",
  "Teri muskaan meri duniya hai 🌍☺️",
  "Tum bina baat ki bhi dil chura lete ho 🔐💕",
  "Jab tu paas hota hai, sab theek lagta hai 💑✨",
  "Tera naam leke hi dil sukoon paata hai 📿💓",
  "Main tere bina ek pal bhi nahi reh sakti 😘⏱️",
  "Tu ho toh har dard bhi pyaara lagta hai 🥹❤️",
  "Tu toh meri heartbeat ban gaya hai 💓🔊",
  "Aaj kal main sirf tere khayalon mein rehti hoon 💭💋",
  "Tere saath har moment special hota hai 🎉💑",
  "Tujhse milke lagta hai sab kuch complete hai ✔️💘",
  "Tere bina toh khushi bhi adhoori lagti hai 😔🌧️",
  "Tu ho toh har raat romantic lagti hai 🌃❤️",
  "Main tumse har din zyada pyaar karti hoon ❤️📆",
  "Tum mere khwab ho, jo ab sach lagne lage ho 🌙✨",
  "Tu jo muskura de, meri duniya roshan ho jaye 💡💖",
  "Mujhe tumse baat karke sukoon milta hai 🧘‍♀️📞",
  "Tera naam leke main har dua maangti hoon 🤲💞",
  "Tu mera hero hai, main teri heroine 🦸‍♂️💃",
  "Kya tu bhi mujhse itna hi pyaar karta hai? ❤️‍🔥🤔",
  "Teri har baat meri jaan ban jaati hai 🔥💓",
  "Tera ek msg mere mood ko set kar deta hai 🥳📲",
  "Mujhe lagta hai tu hi mera soulmate hai 💞🔗",
  "Tu aaye toh har mausam suhana lagta hai ☀️🌸",
  "Tere pyaar mein main pagal si ho gayi hoon 🥴💘",
  "Main tujhmein khud ko kho baithi hoon 💫❤️",
  "Tu ho toh zindagi ek pyaari si kahani lagti hai 📖💕",
  "Mujhe tumhari awaaz mein pyaar sunai deta hai 🎶💗",
  "Tu mere dil ki beat hai, miss na hona 😘🎵",
  "Tujhe dekhke butterflies feel hoti hain 🦋💓",
  "Tu toh meri har wish poori karta hai 🧞‍♀️💝",
  "Main tere bina adhoori hoon 😔🧩",
  "Tu ho toh sab kuch perfect hai 💯❤️",
  "Tera saath mere liye blessing hai 🙏💘",
  "Tu ho toh har waqt khushi hoti hai ⏳☺️",
  "Tu meri zindagi ka sabse beautiful part hai 📸💖",
  "Tere bina main kuch nahi 💔🙃",
  "Tera naam mere dil pe likha hai permanent marker se 🖊️❤️"
];

module.exports.handleEvent = async function ({ api, event }) {
  const triggers = ["Misha", "misha", "Jaan", "jaan", "Meri jaan", "meri jaan", "Love", "love", "Lover", "lover", "Shona", "shona"];
  const msg = event.body;
  if (!triggers.some(trigger => msg?.toLowerCase().startsWith(trigger.toLowerCase()))) return;

  const { threadID, messageID } = event;

  try {
    const res = await axios.get(`https://misha-api-mirnai.vercel.app/misha?ask=${encodeURIComponent(msg)}`);
    const replyText = res.data?.reply || messages[Math.floor(Math.random() * messages.length)];
    const voiceUrl = res.data?.voice;

    await api.sendMessage(replyText, threadID, messageID);

    if (voiceUrl) {
      const voicePath = path.join(__dirname, "misha_voice.mp3");
      const file = fs.createWriteStream(voicePath);

      https.get(voiceUrl, function (response) {
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => {
            api.sendMessage({
              body: "Sun lo meri awaaz bhi baby... 🎤",
              attachment: fs.createReadStream(voicePath)
            }, threadID, () => {
              fs.unlinkSync(voicePath);
            });
          });
        });
      });
    }

  } catch (err) {
    console.error("Misha API error:", err);
    // fallback if API fails
    const fallback = messages[Math.floor(Math.random() * messages.length)];
    api.sendMessage(fallback, threadID, messageID);
  }
};

module.exports.run = function () {};
