Module.exports.config = {
    name: "mention",
    version: "1.0.1", // Chhota version update
    hasPermission: 2, // hasPermssion ki spelling theek ki
    credits: "Rudra + Lazer DJ Meham + Google Gemini", // Galiyan ke credits add kiye
    description: "Track a user and automatically gali them when they message.", // Description update ki
    // Usages wahi rakhe jo tumhare purane code mein the
    usages: "mention @user | stopmention | startmention",
    cooldowns: 5
};

// Galiyan ki list (naye code se copy ki hui)
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


let mentionStatus = true; // Jaise tumhare purane code mein tha, shuru mein true
let mentionedUsers = new Set(); // List ke liye Set

// Tumhara purana run function - yahi control karega commands aur users ko add karna
// Yeh message ke pure body ko match karega "stopmention" ya "startmention" se
module.exports.run = async function({ api, event, Users, permission }) { // Users argument use nahi ho raha
   const { threadID, senderID, mentions, body } = event;

   // Handle stopmention command (poore body ka exact match)
   // Sirf admin ke liye allow karein stop/start
   if (body && body.toLowerCase() === "stopmention") {
       if (permission !== 2) {
           return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
       }
       mentionStatus = false; // System OFF
       mentionedUsers.clear(); // List clear
       return api.sendMessage("Mention system OFF ho gaya hai.", threadID);
   }

   // Handle startmention command (poore body ka exact match)
   if (body && body.toLowerCase() === "startmention") {
        if (permission !== 2) {
           return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
       }
       mentionStatus = true; // System ON
       return api.sendMessage("Mention system ON ho gaya hai.", threadID);
   }

   // Agar system ON hai aur message mein koi mention hai, toh us user ko track list mein add karein
   // Yeh har mention wale message par chalega agar system ON hai
   if (mentionStatus && mentions && Object.keys(mentions).length > 0) {
      const mentionID = Object.keys(mentions)[0]; // Pehle mention kiye hue user ki ID lein
      // Tumhare purane code mein yahi logic tha add karne ka
      const mentionName = mentions[mentionID].replace("@", "");
      mentionedUsers.add(mentionID); // User ko list mein add karein
      // Jaise tumhare purane code mein confirmation message tha
      return api.sendMessage({ body: `${mentionName}, oye.`, mentions: [{ id: mentionID, tag: mentionName }] }, threadID);
   }

    // Agar message upar ke kisi condition se match nahi kiya, toh yeh run function kuch nahi karega.
    // Purane code mein invalid usage message nahi tha.
};


// Naye code se handleEvent function - yahi random gali bhejne ka kaam karega
module.exports.handleEvent = async function({ api, event }) {
   const { threadID, senderID, body } = event;

   // Bot ke messages ignore karein
   if (senderID === api.getCurrentUserID()) return;

   // Optional: Commands ko ignore karein agar woh bhi handleEvent trigger karein
   // Yeh purane run logic ke saath kam zaruri hai
   // Agar body "stopmention" ya "startmention" hai toh ignore karein
   // if (body && ["stopmention", "startmention"].includes(body.toLowerCase())) return;
   // Agar body prefix aur command name "mention" se shuru hoti hai (standard command) toh ignore karein
   // if (body && global.config.PREFIX && body.toLowerCase().startsWith(global.config.PREFIX + this.config.name)) return;


   // Check karein ki mention system ON hai AND message bhejne wala user tracked hai
   if (mentionStatus && mentionedUsers.has(senderID)) {
      // Ek random gali select karein
      const gali = galiyan[Math.floor(Math.random() * galiyan.length)];

      try {
         // User ka naam fetch karein mention karne ke liye (naye code se)
         const userInfo = await api.getUserInfo(senderID);
         const name = userInfo[senderID]?.name || "bhosdike"; // Agar naam nahi mila toh fallback

         // Gali bhejein, user ko mention karte hue
         return api.sendMessage({
            body: `${name}, ${gali}`,
            mentions: [{ id: senderID, tag: name }]
         }, threadID);

      } catch (err) {
         console.error("Error fetching user info for gali:", err);
         // Agar naam fetch nahi hua toh bina mention ke gali bhej dein
         return api.sendMessage(gali, threadID);
      }
   }
};
