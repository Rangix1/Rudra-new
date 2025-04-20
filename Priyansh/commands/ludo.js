// Yeh ek Mirai framework command file ka structure hai.
// Is file ko Mirai bot ke 'commands' folder mein save kar sakte hain,
// jaise 'ludo.js' naam se.

// *******************************************************************
// Mirai Command Configuration
// Yahan aap command ka naam aur description set karte ho.
// Name: 'ludo' matlab aap '/ludo' ya jo prefix set hai uske sath 'ludo' command use karoge.
// Yaa simply message body check karke bina prefix ke bhi trigger kar sakte hain.
// User ne 'ludo link' command bola hai, toh hum seedha message body check karenge.
// *******************************************************************
module.exports.config = {
    name: "ludo", // Command ka naam (agar aap prefix use kar rahe ho toh)
    version: "1.0.0",
    hasPermssion: 0, // Kon log is command ko use kar sakte hain (0 = all users)
    credits: "Rudra", // Apna naam likh lo yahan
    description: "Sends Ludo King app download links.", // Command kya karti hai
    commandCategory: "Utility", // Command ki category
    usages: "ludo link", // Command use karne ka tarika
    cooldowns: 5 // Kitne seconds baad dobara use kar sakte hain
};

// *******************************************************************
// WOH LINKS JO AAP BOT SE BHJHWANA CHAHTE HO.
// Yeh Ludo King (FB wala Ludo) app ke official links hain.
// *******************************************************************
const ludoKingAndroidLink = "https://play.google.com/store/apps/details?id=com.king.ludo.star.game"; // Android ka link
const ludoKingiOSLink = "https://apps.apple.com/us/app/ludo-king/id993090512";       // iOS (iPhone) ka link

// *******************************************************************
// YEH WOH FUNCTION HAI JO TAB CHALTA HAI JAB COMMAND DETECT HOTI HAI.
// api: Bot se interaction ke liye (message send karna, etc.)
// event: Aaya hua message aur uski details (kisne bheja, kis group/chat mein aaya)
// *******************************************************************
module.exports.run = async function({ api, event }) {
    const threadID = event.threadID; // Kis chat/group mein message aaya hai
    const messageBody = event.body;   // User ka bheja hua message text

    // Aap decide kar sakte ho ki bot kis text par react karega.
    // User ne bola 'ludo link'. Hum check karte hain ki message exactly 'ludo link' hai ya nahi
    // ya 'ludo link' se start hota hai (case-insensitive).
    const triggerCommand = "ludo link";

    // Check if the message body matches the trigger command (case-insensitive)
    if (messageBody && messageBody.toLowerCase().includes(triggerCommand.toLowerCase())) {
         // Agar message mein 'ludo link' text hai, toh yeh reply message banao

         const replyMessage =
             `Hello! Aapne Ludo link manga hai.\n` +
             `Yeh raha Ludo King app ka download link (jo Facebook se connect hota hai):\n` +
             `\nAndroid Users: ${ludoKingAndroidLink}` + // Android link yahan add ho jayega
             `\niOS Users: ${ludoKingiOSLink}` +       // iOS link yahan add ho jayega
             `\n\nApp download karke Facebook se login kar sakte ho.` + // Kuch extra info
             `\n\n(Agar aapne '${triggerCommand}' type kiya hai toh)` // Optional: Confirm user's input

         // Ab yeh message group mein bhej do jahan se command aayi thi.
         api.sendMessage(replyMessage, threadID);

         // Agar aap chahte ho ki bot sirf tab reply kare jab message EXACTLY 'ludo link' ho,
         // toh condition ko aise kar sakte ho:
         // if (messageBody && messageBody.toLowerCase() === triggerCommand.toLowerCase()) { ... }

         // Agar aap chahte ho ki bot prefix command par react kare (jaise /ludo), toh aapko
         // Mirai ke built-in command handling ka use karna hoga aur 'module.exports.config.name' set karna hoga.
         // Upar config mein 'name: "ludo"' set hai. Agar Mirai mein command prefix '/' hai,
         // toh user '/ludo' type karega aur yeh code run hoga.
         // Is example mein humne seedha 'ludo link' text par trigger set kiya hai.
    }

};
