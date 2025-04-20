// सुनिश्चित करें कि आपने node-gtts लाइब्रेरी इंस्टॉल की है: npm install node-gtts
const gtts = require('node-gtts')('hi'); // Default to Hindi, will change based on user input
const fs = require('fs-extra'); // Using fs-extra as already in dependencies
const path = require('path'); // Using path as already in dependencies

module.exports.config = {
    name: "say", // कमांड का नाम
    version: "1.0.2", // वर्जन अपडेट कर सकते हैं
    hasPermssion: 0, // कौन उपयोग कर सकता है (0 = कोई भी)
    credits: "Rudra", // अपना नाम लिखें
    description: "Converts text to speech and sends as a voice message", // कमांड का विवरण
    commandCategory: "Media", // कमांड की कैटेगरी
    usages: "[lang] [text]", // कमांड का उपयोग कैसे करें - भाषा कोड अब पहले आएगा
    cooldowns: 5, // कमांड को दोबारा चलाने से पहले कितना इंतज़ार करना है
    dependencies: {
        "path": "",
        "fs-extra": "",
        "node-gtts": "" // node-gtts को dependencies में जोड़ना अच्छा होगा
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        // चेक करें कि यूजर ने कोई टेक्स्ट दिया है या नहीं
        if (args.length === 0 && event.type !== "message_reply") {
             return api.sendMessage("कृपया टेक्स्ट दें जिसे आप वॉयस में बदलवाना चाहते हैं।\nउदाहरण: /say hi नमस्ते बॉट", event.threadID, event.messageID);
        }

        let languageToSay = global.config.language || 'en'; // Default to config language or English
        let textToSay = "";

        // इनपुट को पार्स करें: पहले आर्गुमेंट को भाषा मानें अगर वह मान्य है
        const possibleLang = args[0]?.toLowerCase();
        const supportedLanguages = ['af', 'sq', 'ar', 'bn', 'bs', 'bg', 'ca', 'zh-CN', 'zh-TW', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fil', 'fi', 'fr', 'de', 'el', 'gu', 'hif', 'hi', 'hu', 'id', 'is', 'it', 'ja', 'jw', 'kn', 'km', 'ko', 'la', 'lv', 'lt', 'ml', 'mr', 'my', 'ne', 'no', 'pl', 'pt', 'ro', 'ru', 'sr', 'si', 'sk', 'su', 'sw', 'ta', 'te', 'th', 'tl', 'tr', 'uk', 'ur', 'uz', 'vi', 'zh-CN', 'zh-TW']; // gtts द्वारा सपोर्टेड भाषाएं (कुछ लोकप्रिय)

        if (args.length > 1 && supportedLanguages.includes(possibleLang)) {
            languageToSay = possibleLang;
            textToSay = args.slice(1).join(" "); // भाषा कोड के बाद का टेक्स्ट लें
        } else {
            // अगर पहला आर्गुमेंट भाषा कोड नहीं है, या सिर्फ एक आर्गुमेंट है, तो पूरा टेक्स्ट लें
            textToSay = args.join(" ");
            // भाषा डिफ़ॉल्ट रहेगी या रिप्लाई के मामले में नीचे हैंडल होगी
        }

        // अगर यह रिप्लाई है, तो रिप्लाई मैसेज का टेक्स्ट लें और भाषा डिफ़ॉल्ट रखें या पहले आर्गुमेंट से लें
        if (event.type === "message_reply") {
             textToSay = event.messageReply.body;
             // अगर रिप्लाई के साथ कमांड में भाषा कोड दिया गया है, तो उसे उपयोग करें
             if (args.length > 0 && supportedLanguages.includes(possibleLang)) {
                 languageToSay = possibleLang;
                 // रिप्लाई मैसेज में से भाषा कोड नहीं हटाना है, पूरा टेक्स्ट TTS को देना है
             } else {
                 // रिप्लाई होने पर args से भाषा कोड नहीं मिला, तो डिफ़ॉल्ट भाषा ही रहेगी
             }
             // Note: When replying, args will only contain text written *with* the reply, not the original replied message text.
             // The logic here needs careful testing based on how args behaves with replies in this framework.
             // For simplicity, if it's a reply, let's just use the reply text and potentially the language from args[0] if present.
              if (args.length > 0 && supportedLanguages.includes(args[0]?.toLowerCase())) {
                 languageToSay = args[0].toLowerCase();
                 // If language code is given *with the reply*, the actual text for TTS is the reply body itself.
                 // The 'textToSay' is already set to event.messageReply.body above.
             } else {
                 // If no language code is given with the reply, use the default language.
                 // textToSay is already event.messageReply.body
             }
             // Ensure textToSay is not empty after handling reply
             if (!textToSay) {
                 return api.sendMessage("रिप्लाई मैसेज में कोई टेक्स्ट नहीं है जिसे वॉयस में बदल सकूं।", event.threadID, event.messageID);
             }
        }


        // अगर टेक्स्ट अभी भी खाली है (जैसे सिर्फ /say ru लिखकर भेजा हो), तो एरर दें
        if (!textToSay.trim()) {
             return api.sendMessage("कृपया टेक्स्ट दें जिसे आप वॉयस में बदलवाना चाहते हैं।", event.threadID, event.messageID);
        }


        // ऑडियो फाइल के लिए एक टेम्परेरी पाथ डिफाइन करें
        const audioFilePath = path.join(__dirname, 'cache', `${event.threadID}_${event.senderID}_${Date.now()}.mp3`); // Cache folder जैसा पहले था

        // cache डायरेक्टरी मौजूद है या नहीं, चेक करें (fs-extra में ensureDir होती है)
        await fs.ensureDir(path.join(__dirname, 'cache'));


        try {
            // 1. टेक्स्ट से ऑडियो फाइल जनरेट करें using node-gtts
            await new Promise((resolve, reject) => {
                const gttsStream = gtts.stream(textToSay, languageToSay); // भाषा पास करें
                const writeStream = fs.createWriteStream(audioFilePath);

                gttsStream.pipe(writeStream);

                writeStream.on('finish', () => resolve());
                writeStream.on('error', (err) => {
                     console.error("Write stream error:", err);
                     reject(err);
                });
                 gttsStream.on('error', (err) => {
                     console.error("gTTS stream error:", err);
                     reject(err); // Handle errors during streaming from gtts
                });
            });

            // 2. ऑडियो फाइल को अटैचमेंट के रूप में भेजें
            const message = {
                attachment: fs.createReadStream(audioFilePath)
            };

            api.sendMessage(
                message,
                event.threadID,
                (err) => { // मैसेज भेजने के बाद का कॉलबैक
                    if (err) {
                        console.error("वॉयस मैसेज भेजने में एरर:", err);
                        // वैकल्पिक: अगर वॉयс भेजने में फेल हुआ
                        api.sendMessage(`सॉरी, वॉयस मैसेज भेज नहीं पाया।`, event.threadID, event.messageID);
                    } else {
                        console.log(`वॉयस मैसेज भेजा गया thread ${event.threadID} पर`);
                    }
                    // 3. टेम्परेरी ऑडियो फाइल को डिलीट करें
                    fs.unlink(audioFilePath, (unlinkErr) => {
                        if (unlinkErr) console.error("टेम्प ऑडियो फाइल डिलीट करने में एरर:", unlinkErr);
                    });
                },
                event.messageID // मूल मैसेज का जवाब दें (वैकल्पिक)
            );

        } catch (error) {
            console.error("वॉयस जनरेट करने या भेजने में एरर:", error);
            // अगर वॉयс जनरेट करने या भेजने में फेल हुआ, तो टेक्स्ट मैसेज भेजें
            api.sendMessage(`सॉरी, आपका टेक्स्ट वॉयस में जनरेट या भेज नहीं पाया।`, event.threadID, event.messageID);
        }
    } catch (e) {
        console.error("कमांड चलाने में अनएक्सपेक्टेड एरर:", e);
        return api.sendMessage(`कमांड चलाते समय एक एरर आ गई: ${e.message}`, event.threadID, event.messageID);
    }
};
