// gfBot.js

function detectMood(message) { const romanticKeywords = ["love", "miss", "jaan", "sweetheart", "baby", "meri gf", "romantic", "cute", "kiss", "hug", "heart", "khaas ho", "meri jaan"]; const roastKeywords = ["pagal", "gawar", "bakwaas", "chup", "kya bakwas", "kutta", "bewakoof", "faltu", "buddhu", "ullu", "nalayak", "kya samjha"]; const funnyKeywords = ["joke", "meme", "funny", "hasi", "lol", "lmao", "masti", "mazak", "comedy"];

const lowerMsg = message.toLowerCase();

if (romanticKeywords.some(word => lowerMsg.includes(word))) return "romantic";
if (roastKeywords.some(word => lowerMsg.includes(word))) return "roast";
if (funnyKeywords.some(word => lowerMsg.includes(word))) return "funny";
return "normal";

}

function getReply(message, userName = "Jaanu") { const mood = detectMood(message);

const replies = {
    romantic: [
        `Awww ${userName}, main bhi tumhe miss karti hoon!`,
        `${userName}, tumhare bina to dil hi nahi lagta.`,
        `Tum ho to sab kuch hai, meri duniya ho tum, ${userName}.`,
        `${userName}, tumhara naam sunke hi blush kar jaati hoon!`,
        `Tumhari baatein dil ko choo jaati hain ${userName}.`,
        `Kabhi kabhi lagta hai tum sirf mere liye bane ho ${userName}.`,
        `Tere bina to meri duniya adhoori lagti hai ${userName}.`,
        `Aaj to romantic mood me ho, mujhe bhi pyaar aa gaya tum pe ${userName}.`
    ],
    roast: [
        `${userName}, tere jaise to main alarm bhi na lagaaun!`,
        `Zyada ud mat ${userName}, wings to tere pass hain nahi!`,
        `${userName}, tu pehle apna dimag charge kar le phir baat karna.`,
        `Beizzati ka contract sign kar liya kya ${userName}?`,
        `Apne muh se itni badbu kyu maar raha hai ${userName}?`,
        `Tere jaise logon ko mute karne ka option hona chahiye real life me bhi.`,
        `Tujhe dekh ke lagta hai cartoon bhi serious ho gaye honge ${userName}.`,
        `Tu to aisa gyaan de raha jaise YouTube pe fake baba ho ${userName}.`
    ],
    funny: [
        `Hahaha! ${userName}, tere joke pe to main pura bot hila diya!`,
        `LOL! ${userName}, tu to mast comedy piece hai!`,
        `Bas bhai ${userName}, ab hasi rok nahi paa rahi hoon!`,
        `Tera meme bhej ${userName}, main bhi reply me meme daalungi!`,
        `Teri harkatein dekhke to main emoji bhi confuse ho gaya hu!`,
        `Mazak ka itna bada overdose na de ${userName}, heart fail ho jaayega!`
    ],
    normal: [
        `Haan bolo ${userName}, kya baat hai?`,
        `Main to yahin hoon ${userName}, batao?`,
        `Aapka msg mila ji ${userName}, boliye na!`,
        `Itni der se aap yaad kar rahe the mujhe ${userName}?`,
        `Sun rahi hoon ${userName}, batao kya kehna hai?`,
        `Aapke bina to chatting boring lagti hai ${userName}.`,
        `Tumhare bina yeh inbox suna suna lagta hai.`,
        `Kuch khaas to nahi, bas tumhari yaad aa rahi thi ${userName}.`
    ]
};

const selected = replies[mood];
return selected[Math.floor(Math.random() * selected.length)];

}

function simulateTyping(callback, delay = 1500) { console.log("[Bot is typing...]"); setTimeout(callback, delay); }

function getProfile() { return { name: "Mohit ki Jaanu Bot", profilePic: "https://example.com/bot-dp.jpg", // Replace with your real image URL status: "Online", }; }

module.exports = { getReply, simulateTyping, getProfile };


