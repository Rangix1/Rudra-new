Module.exports.config = {
    name: "mention", // Command name remains "mention"
    version: "1.2.0", // Version updated
    hasPermission: 2, // Admin permission required for all actions in run
    credits: "Rudra + Lazer DJ Meham + Google Gemini", // Added credits
    description: "Track a user and automatically gali them when they message.",
    commandCategory: "group",
    // Updated usages to reflect the command syntax
    usages: "mention start | mention stop | mention @user",
    cooldowns: 5
};

// Yeh variables bot ke chalte waqt yaad rahenge
let mentionStatus = false; // System ON/OFF status
let mentionedUsers = new Set(); // Jin users ko track karna hai unki IDs yaha store hongi

// Galiyan ki list wohi hai
const galiyan = [
   `Teri maa ki chut mein ganna ghusa ke juice nikal dun, kutte ke pille tere jaise pe to thook bhi na phekhu main, aukat dekh ke muh khol haramkhor!`,
   `Bhosdike, tere jaise chhoti soch wale chhapriyo ka toh main churan banake nasha kar jaun, maa chod pagal aadmi!`,
   `Tere baap ka naak kaat diya kal, aur teri maa toh bolti thi beta engineer banega, chutiya nikla!`,
   `Teri gaand mein rocket daalke chand tak bhej du, vahan jakar aliens ko bhi chutiya bana ke aaega tu.`,
   `Abe chutmarani ke ladke, tu aaya firse gaand maraane? Tere liye toh gali bhi chhoti padti hai re behanchod!`,
   `Tere muh mein gobar bhar ke usko milkshake bana ke tujhe piladu, bhonsdi ke tere liye toh Safai Abhiyan chalani padegi.`,
   `Jab tu paida hua toh doctor ne bola tha, isko zinda chod diya toh samaj barbaad ho jaega, lekin teri maa boli — gaand mara ke paida kiya hai, zinda chhod!`,
   `Tere jaise chutiye ko toh gaali dena bhi beizzati hai gaali ki, phir bhi sun — teri maa ka bhosda, baap ka lund!`,
   `Tujhpe toh jis din bhagwan ka prakop aaya na, saala gaand se dhua nikal jaega, fir bhi tu sudhrega nahi be nalayak!`,
   `Abe teri maa ki aankh, tujhme toh gaand bhi nahi hai chaatne layak, aur attitude aisa jaise Elon Musk ka driver ho!`,
   `Oye bhadwe, teri maa ka bhosda aur baap ki gaand mein dhol bajaun, itna chutiya hai tu ki jaise haryana ke sabse bade bewakoof ka prototype ho.`,
   `Tere jaise nalayak ko dekh ke bhagwan bhi sochta होगा ki kyu banaya is haramkhor ko, kutti ke pyar se paida hua hai tu, chappal se pitega!`,
   `Gaand mein mirchi bhar ke chakki chalau tera, teri maa chillaegi – maaro mujhe maaro – aur tu side me selfie le raha hoga behanchod!`,
   `Tere ghar mein shadi hui thi ya buffalo fight thi? Aisi shakal hai teri jaise 3rd hand condom ka side effect ho.`,
   `Tere baap ki moochh pakad ke kheenchu itna ki usse kite udaun, aur tujhe tere nange bhitar ghusa ke global warming ka reason bana du.`,
   `Abe kutte, tujhme toh dimaag itna kam hai ki mobile mein airplane mode on karke sochta hai flight chal rahi hai, chutiya kahin ka!`,
   `Tere jaise chhapriyo ke liye toh WhatsApp ne "Block" ka option banaya tha, warna sabki gaand phat jaati daily teri bakchodi sun ke.`,
   `Jab tu paida hua tha tab doctor ne bola tha – abey isko zinda chod diya toh galti ho jaegi, lekin teri maa boli – mujhe aur bhi chutiya chahiye!`,
   `Abe laude, tujhme toh itni akal bhi nahi ki bhains ke aage been bajaye bina bhi nachna shuru kar de, tera brain toh Gaadi ke silencer me chala gaya.`,
   `Tu gaaliyon ke layak bhi nahi, tu toh us toilet paper jaisa hai jo har kisi ne liya bhi aur faad bhi diya – fir bhi zinda hai.`,
   `Jab tu bolta hai na, toh lagta hai kisi ne gaand mein flute daal di ho, itna irritating awaz hai – mute karne ka man karta hai tujhe dekhte hi.`,
   `Abe behanchod, tujhe dekhta hoon toh lagta hai jaise kisi ne chawal se laptop banane ki koshish ki ho – bekaar, slow, aur useless.`
];

// Yeh function tab chalta hai jab user "[prefix]mention ..." command use karta hai
module.exports.run = async function({ api, event, permission, args }) {
   const { threadID, senderID, mentions } = event; // event mein mentions property hoti hai jab koi mention hota hai

   // Check karein ki command chalane wale ke paas admin permission hai ya nahi
   if (permission < 2) {
      return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
   }

   const firstArg = args[0]?.toLowerCase(); // Command ke baad pehla word dekhein (start, stop ya kuch aur?)

   if (firstArg === "start") {
      // System ON karne ka logic
      if (mentionStatus) {
         return api.sendMessage("Mention system pehle se hi ON hai.", threadID, event.messageID);
      }
      mentionStatus = true;
      return api.sendMessage("Mention system ON ho gaya hai. Ab mention @user karke logo ko track list me add kar sakte ho.", threadID, event.messageID);

   } else if (firstArg === "stop") {
      // System OFF karne ka logic
      if (!mentionStatus) {
         return api.sendMessage("Mention system pehle se hi OFF hai.", threadID, event.messageID);
      }
      mentionStatus = false;
      mentionedUsers.clear(); // System band karte waqt list bhi clear kar dein
      return api.sendMessage("Mention system OFF ho gaya hai. Tracked users list bhi clear ho gayi hai.", threadID, event.messageID);

   } else {
      // Agar pehla word "start" ya "stop" nahi hai, toh hum maanenge ki user add karna chahta hai (@user mention karke)
      // Iske liye check karein ki message mein koi mention hai ya nahi
      if (mentions && Object.keys(mentions).length > 0) {
          // Agar mention system ON nahi hai toh user ko batayein
           if (!mentionStatus) {
                return api.sendMessage("Mention system abhi OFF hai. Pehle '" + global.config.PREFIX + "mention start' command se ON karo fir add karo.", threadID, event.messageID);
            }

           const mentionedIDs = Object.keys(mentions);
           let addedCount = 0;
           let addedNames = [];
           let alreadyTrackedNames = [];

           // Mentioned users ko tracking list (Set) mein add karein
           for (const mentionID of mentionedIDs) {
               // Optional: Bot ya command chalane wale ko track na karein
               // if (mentionID === api.getCurrentUserID() || mentionID === senderID) continue;

               if (!mentionedUsers.has(mentionID)) {
                   mentionedUsers.add(mentionID);
                   addedCount++;
                   // mentions object se user ka naam mil jaata hai (agar available ho)
                   addedNames.push(mentions[mentionID].replace("@", ""));
               } else {
                   alreadyTrackedNames.push(mentions[mentionID].replace("@", ""));
               }
           }

           let response = "";
           if (addedCount > 0) {
               response += `${addedNames.join(", ")} ka record lag gaya. Ab ye log kuch bolenge toh gali milegi.\n`;
           }
            if (alreadyTrackedNames.length > 0) {
               response += `${alreadyTrackedNames.join(", ")} pehle se hi tracked hain.\n`;
            }

           if (response === "") {
               response = "Kuch nahi hua. Shayad koi valid user mention nahi kiya ya bot/admin ko mention kiya?";
           }

           // Response message mein bhi mention tag add karein taaki woh highlighted dikhe
           let messageMentions = mentionedIDs.map(id => ({ id: id, tag: mentions[id].replace("@", "") }));

           return api.sendMessage({ body: response.trim(), mentions: messageMentions }, threadID, event.messageID);

       } else {
           // Agar pehla word start/stop nahi hai aur koi mention bhi nahi hai, toh invalid usage batayein
           return api.sendMessage(`Invalid usage. Please use: ${global.config.PREFIX}mention start | ${global.config.PREFIX}mention stop | ${global.config.PREFIX}mention @user`, threadID, event.messageID);
       }
   }
};

// Yeh function har message/event par chalta hai thread mein
module.exports.handleEvent = async function({ api, event }) {
   const { threadID, senderID, body } = event;

   // Agar message bot ne khud bheja hai toh ignore karein
   if (senderID === api.getCurrentUserID()) return;

   // Agar message ek command hai (mention command hi hai toh ignore karein, dusre commands par reaction theek hai)
   if (body && body.toLowerCase().startsWith(global.config.PREFIX + this.config.name)) return;


   // Check karein ki mention system ON hai AND message bhejne wala user tracked list mein hai ya nahi
   if (mentionStatus && mentionedUsers.has(senderID)) {
      // Ek random gali select karein
      const gali = galiyan[Math.floor(Math.random() * galiyan.length)];

      try {
         // User ka naam fetch karein mention karne ke liye
         const userInfo = await api.getUserInfo(senderID);
         const name = userInfo[senderID]?.name || "bhosdike"; // Agar naam nahi milta toh "bhosdike" use karein

         // Gali bhejein, user ko mention karte hue
         return api.sendMessage({
            body: `${name}, ${gali}`,
            mentions: [{ id: senderID, tag: name }]
         }, threadID);

      } catch (err) {
         console.error("User name fetch failed for gali:", err);
         // Agar naam fetch nahi hua toh bina mention ke gali bhej dein
         return api.sendMessage(gali, threadID);
      }
   }
};
