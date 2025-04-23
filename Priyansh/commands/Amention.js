Module.exports.config = {
    name: "mention", // Naam "mention" hi rakha hai jaisa tumhare currently running code mein hai
    version: "1.0.3", // Version updated
    hasPermission: 2, // Corrected typo from hasPermssion
    credits: "Rudra + Lazer DJ Meham + Google Gemini", // Added Gali credits
    description: "Track a user and automatically gali them when they message.", // Updated description
    // Usages wahi rakhe jo tumhare code mein hain
    usages: "mention @user | stopmention | startmention",
    cooldowns: 5
};

// Galiyan ki list (jaisi tumhare code mein hai)
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
   `Tere jaise chhapriyo ke liye toh WhatsApp ne "Block" ka option banaya था, warna sabki gaand phat jaati daily teri bakchodi sun ke.`,
   `Jab tu paida hua tha tab doctor ne bola tha – abey isko zinda chod diya toh galti ho jaegi, lekin teri maa boli – mujhe aur bhi chutiya chahiye!`,
   `Abe laude, tujhme toh jitni akal bhi nahi ki bhains ke aage been bajaye bina bhi nachna shuru kar de, tera brain toh Gaadi ke silencer me chala gaya.`,
   `Tu gaaliyon ke layak bhi nahi, tu toh us toilet paper jaisa hai jo har kisi ne liya bhi aur faad bhi diya – fir bhi zinda hai.`,
   `Jab tu bolta hai na, toh lagta hai kisi ne gaand mein flute daal di ho, itna irritating awaz hai – mute karne ka man karta hai tujhe dekhte hi.`,
   `Abe behanchod, tujhe dekhta hoon toh lagta hai jaise kisi ne chawal se laptop banane ki koshish ki ho – bekaar, slow, aur useless.`
];


// State variables (from your currently running code)
let mentionStatus = true; // Jaise tumhare code mein tha
let mentionedUsers = new Set();

// run function (from your currently running code) - Commands aur user add karna
// YEH WAHI RUN FUNCTION HAI JO TUMHARA CHAL RAHA HAI ABHI
module.exports.run = async function({ api, event, Users, permission }) { // Users argument included as in your code
  const { threadID, senderID, mentions, body } = event;

  // Handle stopmention (exact body match)
  // Permission level 2 admin chahiye
  if (body && body.toLowerCase() === "stopmention") { // Added body check
    if (permission !== 2) {
      return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
    }
    mentionStatus = false;
    mentionedUsers.clear();
    return api.sendMessage("Mention system OFF ho gaya hai.", threadID);
  }

  // Handle startmention (exact body match)
  if (body && body.toLowerCase() === "startmention") { // Added body check
    if (permission !== 2) {
      return api.sendMessage("Sirf admin hi is command ko chala sakta hai.", threadID, event.messageID);
    }
    mentionStatus = true;
    return api.sendMessage("Mention system ON ho gaya hai.", threadID);
  }

  // Add user if system ON and message has mention
  // YAHI PART HAI JO "+mention user @user" SE CHAL RAHA HAI TUMHARA ABHI
  if (mentionStatus && mentions && Object.keys(mentions).length > 0) {
    const mentionID = Object.keys(mentions)[0];
    const mentionName = mentions[mentionID].replace("@", "");
    mentionedUsers.add(mentionID);

    // Original confirmation message (jaisa tumhe mil raha hai)
    return api.sendMessage({
      body: `${mentionName}, oye.`,
      mentions: [{ id: mentionID, tag: mentionName }]
    }, threadID);
  }

  // Original code mein invalid usage message nahi tha.
};


// handleEvent - *** YEH AB GALI BHEJEGA ***
module.exports.handleEvent = async function({ api, event, permission }) { // permission add kiya
  const { threadID, senderID, body, messageID } = event; // body, messageID add kiya

  // Bot messages ignore
  if (senderID === api.getCurrentUserID()) return;

  // Optional: Commands ignore karein agar handleEvent trigger karein
  // Commands jo body match se hain ("stopmention", "startmention")
  if (body && ["stopmention", "startmention"].includes(body.toLowerCase())) return;
  // Commands jo prefix + name se shuru hote hain aur mention ho (+mention user @user)
   if (body && global.config && global.config.PREFIX && body.toLowerCase().startsWith(global.config.PREFIX + this.config.name)) {
        if (event.mentions && Object.keys(event.mentions).length > 0) {
             return; // Agar yeh mention command hai jisse user add ho raha hai, to isko ignore karo reaction ke liye
        }
        // Agar yeh command hai lekin mention nahi hai (jaise +mention bina kuch bole)
        // Isko bhi ignore kar sakte hain
         return;
    }


  // Agar system ON hai aur user tracked hai
  if (mentionStatus && mentionedUsers.has(senderID)) {
    // Random gali select karein
    const gali = galiyan[Math.floor(Math.random() * galiyan.length)];

    try {
      // User ka naam fetch karein
      const userInfo = await api.getUserInfo(senderID);
      const name = userInfo[senderID]?.name || "bhosdike"; // Fallback

      // *** YAHAN GALI BHEJI JAA RAHI HAI ***
      return api.sendMessage({
        body: `${name}, ${gali}`,
        mentions: [{ id: senderID, tag: name }]
      }, threadID, messageID); // messageID add kiya
    } catch (err) {
      console.error("Error fetching user info for gali:", err);
      // Agar naam fetch fail hua
      return api.sendMessage(gali, threadID, messageID); // messageID add kiya
    }
  }
  // Agar system OFF ya user not tracked, handleEvent kuch nahi karega.
};
