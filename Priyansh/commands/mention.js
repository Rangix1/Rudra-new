Module.exports.config = {
    name: "mention",
    version: "1.5.0", // Version updated for debugging logs
    hasPermission: 2, // Config mein 2 rehne dete hain
    credits: "Rudra + Lazer DJ Meham + Google Gemini",
    description: "Track a user and automatically gali them when they message.",
    commandCategory: "group",
    usages: "mention start | mention stop | mention @user",
    cooldowns: 5
};

let mentionStatus = false;
let mentionedUsers = new Set();

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

module.exports.run = async function({ api, event, permission, args }) {
   const { threadID, senderID, mentions } = event;

   // Hardcoded Admin ID - Apni User ID Yahan Confirm Karlo Agar Yehi Hai
   const allowedAdminID = "6150558518720"; // <--- Tumhari User ID

   // --- DEBUG LOGS ADDED ---
   console.log("--- DEBUG RUN START --- Command Received.");
   console.log("--- DEBUG RUN START --- Sender ID:", senderID);
   console.log("--- DEBUG RUN START --- Permission Level:", permission);
   console.log("--- DEBUG RUN START --- Allowed Admin ID:", allowedAdminID);
   console.log("--- DEBUG RUN START --- Args:", args);
   console.log("--- DEBUG RUN START --- Mentions:", Object.keys(mentions || {}).length);
   // -------------------------

   // Check permission OR hardcoded ID
   if (permission < 2 && senderID !== allowedAdminID) {
      // --- DEBUG LOG ---
      console.log("--- DEBUG RUN STOP --- Permission DENIED.");
      // ---------------
      return api.sendMessage("Sirf is module ka khaas admin hi yeh command chala sakta hai.", threadID, event.messageID);
   }

   // --- DEBUG LOG ---
   console.log("--- DEBUG RUN CONTINUE --- Permission check PASSED or BYPASSED.");
   // ---------------

   const firstArg = args[0]?.toLowerCase(); // Command ke baad pehla argument dekhein

   if (firstArg === "start") {
       // --- DEBUG LOG ---
       console.log("--- DEBUG RUN BLOCK --- Inside 'start' block.");
       // ---------------
       if (mentionStatus) {
           return api.sendMessage("Mention system pehle se hi ON hai.", threadID, event.messageID);
       }
       mentionStatus = true;
       return api.sendMessage("Mention system ON ho gaya hai. Ab mention @user karke logo ko track list me add kar sakte ho.", threadID, event.messageID);

   } else if (firstArg === "stop") {
       // --- DEBUG LOG ---
       console.log("--- DEBUG RUN BLOCK --- Inside 'stop' block.");
       // ---------------
       if (!mentionStatus) {
           return api.sendMessage("Mention system pehle se hi OFF hai.", threadID, event.messageID);
       }
       mentionStatus = false;
       mentionedUsers.clear();
       return api.sendMessage("Mention system OFF ho gaya hai. Tracked users list bhi clear ho gayi hai.", threadID, event.messageID);

   } else { // Agar pehla argument "start" ya "stop" nahi hai, toh maanenge user add kar raha hai ya invalid command hai
       // --- DEBUG LOG ---
       console.log("--- DEBUG RUN BLOCK --- Inside 'else' (add user or invalid command) block.");
       // ---------------
       if (!mentionStatus) {
           // --- DEBUG LOG ---
           console.log("--- DEBUG RUN BLOCK --- System is OFF.");
           // ---------------
           if (mentions && Object.keys(mentions).length > 0) { // Agar system OFF hai par mention hai, system ON karne ko kaho
                return api.sendMessage("Mention system abhi OFF hai. Pehle '" + global.config.PREFIX + "mention start' command se ON karo fir add karo.", threadID, event.messageID);
            }
            // Agar system OFF hai aur mention bhi nahi, toh invalid usage hai (neeche handle hoga)
       }

       // User add karne ka logic (jab command ke baad mention ho)
       if (mentions && Object.keys(mentions).length > 0) {
           // --- DEBUG LOG ---
           console.log("--- DEBUG RUN BLOCK --- Mentions found, attempting to add users.");
           // ---------------
           const mentionedIDs = Object.keys(mentions);
           let addedCount = 0;
           let addedNames = [];
           let alreadyTrackedNames = [];

           for (const mentionID of mentionedIDs) {
               if (!mentionedUsers.has(mentionID)) {
                   mentionedUsers.add(mentionID);
                   addedCount++;
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

           let messageMentions = mentionedIDs.map(id => ({ id: id, tag: mentions[id].replace("@", "") }));

           return api.sendMessage({ body: response.trim(), mentions: messageMentions }, threadID, event.messageID);

       } else {
           // Na argument start/stop hai, na hi mention -> Invalid usage
           // --- DEBUG LOG ---
           console.log("--- DEBUG RUN BLOCK --- No valid argument or mentions. Invalid usage.");
           // ---------------
           return api.sendMessage(`Invalid usage. Please use: ${global.config.PREFIX}mention start | ${global.config.PREFIX}mention stop | ${global.config.PREFIX}mention @user`, threadID, event.messageID);
       }
   }
};

// handleEvent remains the same (reacts with galis)
module.exports.handleEvent = async function({ api, event }) {
   const { threadID, senderID, body } = event;

   // Ignore bot messages
   if (senderID === api.getCurrentUserID()) return;

   // Ignore command messages for this module
   if (body && global.config.PREFIX && body.toLowerCase().startsWith(global.config.PREFIX + this.config.name)) return;

   // If system ON AND sender is tracked
   if (mentionStatus && mentionedUsers.has(senderID)) {
      const gali = galiyan[Math.floor(Math.random() * galiyan.length)];
      try {
         const userInfo = await api.getUserInfo(senderID);
         const name = userInfo[senderID]?.name || "bhosdike";
         return api.sendMessage({
            body: `${name}, ${gali}`,
            mentions: [{ id: senderID, tag: name }]
         }, threadID);
      } catch (err) {
         console.error("Error fetching user info for gali:", err);
         return api.sendMessage(gali, threadID);
      }
   }
};
