module.exports.config = {
   name: "mention",
   version: "1.0.0",
   hasPermission: 2,
   credits: "Rudra + Lazer DJ Meham",
   description: "Track a user and automatically gali them when they message.",
   commandCategory: "group",
   usages: "mention @user | stopmention | startmention",
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
   `Tere jaise nalayak ko dekh ke bhagwan bhi sochta hoga ki kyu banaya is haramkhor ko, kutti ke pyar se paida hua hai tu, chappal se pitega!`,
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

module.exports.run = async function({ api, event, permission }) {
   const { threadID, senderID, mentions, body } = event;

   // Check if the user has permission to use "startmention" or "stopmention" commands
   if (["stopmention", "startmention"].includes(body.toLowerCase()) && permission !== 2) {
      return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
   }

   // Stop mention system
   if (body.toLowerCase() === "stopmention") {
      mentionStatus = false;
      mentionedUsers.clear();
      return api.sendMessage("Mention system OFF ho gaya hai.", threadID);
   }

   // Start mention system
   if (body.toLowerCase() === "startmention") {
      mentionStatus = true;
      return api.sendMessage("Mention system ON ho gaya hai.", threadID);
   }

   // If mention system is ON, track the mentioned user
   if (mentionStatus && mentions && Object.keys(mentions).length > 0) {
      const mentionID = Object.keys(mentions)[0];
      const mentionName = mentions[mentionID].replace("@", "");
      mentionedUsers.add(mentionID);

      return api.sendMessage({
         body: `${mentionName}, oye! Tera record lag gaya. Ab kuch bola toh gali milegi.`,
         mentions: [{ id: mentionID, tag: mentionName }]
      }, threadID);
   }
};

module.exports.handleEvent = async function({ api, event }) {
   const { threadID, senderID } = event;

   // If mention system is ON, check if the user is mentioned
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
         console.error("User name fetch failed:", err);
         return api.sendMessage(gali, threadID);
      }
   }
};
