const fs = global.nodemodule["fs-extra"]; module.exports.config = { name: "goibot", version: "1.0.1", hasPermssion: 0, credits: "Fixed By Arun Kumar, Mood Added By Rudra", description: "goibot", commandCategory: "Noprefix", usages: "noprefix", cooldowns: 5, };

module.exports.handleEvent = async function({ api, event, args, Threads, Users }) { const moment = require("moment-timezone"); const time = moment.tz("Asia/Kolkata").format("DD/MM/YYYY || HH:mm:ss"); var { threadID, messageID } = event; var name = await Users.getNameUser(event.senderID);

// Mood wise reply lists const replies = { bot: [ "Kya Tu ELvish Bhai Ke Aage Bolega🙄", "Cameraman Jaldi Focus Kro 📸", "Lagdi Lahore di aa🙈", // (add rest...) ], happy: [ "Khushi ke aansu aa gaye re!", "Hasi ke patakhe phut rahe hain!", "Tu hamesha khush rahe yaar!", // (fill up to 50) ], sad: [ "Kya hua dukh dard waale insaan?", "Mat ro yaar, sab theek ho jaayega!", "Dil toota hai kya?", // (fill up to 50) ], romantic: [ "Pyaar dikh raha hai aankhon mein!", "Ishq wala love detected!", "Dil garden garden ho gaya!", // (fill up to 50) ], angry: [ "Itna gussa kyun bhai?", "Shant ho jao, gussa health ke liye kharaab hai!", "Mujhe mat maarna, innocent hu!", // (fill up to 50) ], roast: [ "Tune to jala ke rakh diya!", "Arey fire brigade bulao!", "Thoda to reham kar bhai!", // (fill up to 50) ] };

// Detect mood keyword from message let foundMood = null; for (let mood in replies) { if (event.body.toLowerCase().includes(mood)) { foundMood = mood; break; } }

if (foundMood) { let rand = replies[foundMood][Math.floor(Math.random() * replies[foundMood].length)]; return api.sendMessage({ body: 🔶${name}🔶, \n『\n   ${rand} 』\n\n❤️𝙲𝚛𝚎𝚍𝚒𝚝𝚜 : Rudra🌹 }, threadID, messageID); } };

module.exports.run = function({ api, event, client, __GLOBAL }) { }

