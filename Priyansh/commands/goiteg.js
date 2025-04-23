tri// Code implemented as a "No prefix" command triggered by message content in handleEvent

// Note: This approach bypasses the standard run function and prefix command dispatching.
// Commands are triggered by phrases in messages within handleEvent.

Const fs = global.nodemodule["fs-extra"]; // Agar file system functions use hone ho, abhi nahi ho rahe code mein
module.exports.config = {
    name: "goiteg", // *** Naya aur alag naam rakha hai conflict se bachne ke liye ***
    version: "2.0.0", // Major version update
    hasPermission: 2, // Permissions will be checked internally for actions
    credits: "Rudra + Lazer DJ Meham + Google Gemini",
    description: "Track a user and automatically gali them when they message using phrases.",
    commandCategory: "No prefix", // *** Yeh ab No prefix command hai ***
    usages: "Type 'goiteg start' or 'goiteg stop' or 'goiteg add @user' in message", // Usages reflect trigger phrases
    cooldowns: 5 // Cooldown agar zaroorat ho
};

// Galiyan list (full list)
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
   `Abe laude, tujhme toh jitni akal bhi nahi ki bhains ke aage been bajaye bina bhi nachna shuru kar de, tera brain toh Gaadi ke silencer me chala gaya.`,
   `Tu gaaliyon ke layak bhi nahi, tu toh us toilet paper jaisa hai jo har kisi ne liya bhi aur faad bhi diya – fir bhi zinda hai.`,
   `Jab tu bolta hai na, toh lagta hai kisi ne gaand mein flute daal di ho, itna irritating awaz hai – mute karne ka man karta hai tujhe dekhte hi.`,
   `Abe behanchod, tujhe dekhta hoon toh lagta hai jaise kisi ne chawal se laptop banane ki koshish ki ho – bekaar, slow, aur useless.`
];

// State variables
let mentionStatus = false; // System ON/OFF status (initial state OFF)
let mentionedUsers = new Set(); // Tracked users

// run function is NOT used for No prefix commands
// module.exports.run = function({ api, event, client, __GLOBAL }) {}; // This can be an empty function or removed


// handleEvent: Ab yeh function commands (phrases) aur reaction dono handle karega
module.exports.handleEvent = async function({ api, event, permission, args }) { // Added permission & args
   const { threadID, senderID, body, messageID, mentions } = event;

   // Ignore bot messages
   if (senderID === api.getCurrentUserID()) return;

   // --- Command Phrase Handling ---
   // Message body ko lowercase mein lein phrases check karne ke liye
   const lowerBody = body?.toLowerCase();

   // Hardcoded Admin ID - Apni User ID Yahan Confirm Karlo Agar Yehi Hai
   const allowedAdminID = "6155055818720"; // <--- Tumhari User ID

   // Admin check: Ya toh standard permission 2+ ho, ya phir hardcoded ID ho
   const hasAdminPermission = (permission >= 2 || senderID === allowedAdminID);


   // "goiteg start" phrase check
   if (lowerBody?.includes("goiteg start")) {
       // Admin permission required for this action
       if (!hasAdminPermission) {
           return api.sendMessage("Sirf is module ka khaas admin hi yeh command chala sakta hai.", threadID, messageID);
       }
       // Logic to start the system
       if (mentionStatus) {
           return api.sendMessage("Teg system pehle se hi ON hai.", threadID, messageID);
       }
       mentionStatus = true;
       return api.sendMessage("Teg system ON ho gaya hai. Ab type 'goiteg add @user' to add users.", threadID, messageID); // Usages update kiye
   }

   // "goiteg stop" phrase check
   if (lowerBody?.includes("goiteg stop")) {
       // Admin permission required for this action
       if (!hasAdminPermission) {
           return api.sendMessage("Sirf is module ka khaas admin hi yeh command chala sakta hai.", threadID, messageID);
       }
       // Logic to stop the system
       if (!mentionStatus) {
           return api.sendMessage("Teg system pehle se hi OFF hai.", threadID, messageID);
       }
       mentionStatus = false;
       mentionedUsers.clear(); // Clear list
       return api.sendMessage("Teg system OFF ho gaya hai. Tracked users list bhi clear ho gayi hai.", threadID, messageID);
   }

   // "goiteg add" phrase check AND mentions check
   // Agar message mein "goiteg add" phrase ho AUR mentions bhi hon
   if (lowerBody?.includes("goiteg add") && mentions && Object.keys(mentions).length > 0) {
       // Admin permission required for this action
       if (!hasAdminPermission) {
           return api.sendMessage("Sirf is module ka khaas admin hi yeh command chala sakta hai.", threadID, messageID);
       }
       // Agar system OFF hai, add nahi kar sakte
       if (!mentionStatus) {
           return api.sendMessage("Teg system abhi OFF hai. Pehle 'goiteg start' type karke ON karo.", threadID, messageID); // Usages update kiye
       }

       // Logic to add users based on mentions in the message
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

       return api.sendMessage({ body: response.trim(), mentions: messageMentions }, threadID, messageID);
   }
    // --- End of Command Phrase Handling ---


   // --- Reaction Handling ---
   // Yeh part har message par chalega jo upar ke command phrases se match nahi hua
   // Check karein ki system ON hai AND message bhejne wala user tracked hai
   if (mentionStatus && mentionedUsers.has(senderID)) {
      const gali = galiyan[Math.floor(Math.random() * galiyan.length)];
      try {
         const userInfo = await api.getUserInfo(senderID);
         const name = userInfo[senderID]?.name || "bhosdike";
         return api.sendMessage({
            body: `${name}, ${gali}`,
            mentions: [{ id: senderID, tag: name }]
         }, threadID, messageID); // messageID add kiya
      } catch (err) {
         console.error("Error fetching user info for gali:", err);
         return api.sendMessage(gali, threadID, messageID); // messageID add kiya
      }
   }
   // Agar system OFF hai ya user tracked nahi hai, toh handleEvent kuch nahi karega.
};

// Optional: Empty run function if required by bot structure
// module.exports.run = function({ api, event, client, __GLOBAL }) {};
