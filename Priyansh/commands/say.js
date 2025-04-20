// सुनिश्चित करें कि आपने node-gtts लाइब्रेरी इंस्टॉल की है: npm install node-gtts
const gtts = require('node-gtts')('en'); // Mirai के लिए डिफ़ॉल्ट भाषा 'en' रखना बेहतर हो सकता है, या इसे config से लें

const fs = require('fs-extra'); // Mirai के लिए standard, सुनिश्चित करें कि यह इंस्टॉल है
const path = require('path'); // Node.js standard, Mirai में उपलब्ध है

module.exports.config = {
    name: "say", // कमांड का नाम
    version: "1.0.3", // वर्जन अपडेट कर सकते हैं (यदि कोई सुधार किया गया हो)
    hasPermssion: 0, // कौन उपयोग कर सकता है (0 = कोई भी, 1 = एडमिन, 2 = बॉट एडमिन)
    credits: "Rudra and Adapted for Mirai", // अपना नाम लिखें और Mirai के लिए अनुकूलन का उल्लेख करें
    description: "Converts text to speech and sends as a voice message using gTTS", // कमांड का विवरण
    commandCategory: "Media", // कमांड की कैटेगरी
    usages: "[lang] [text] or reply to a message with [lang]", // उपयोग का तरीका स्पष्ट करें
    cooldowns: 5, // कमांड को दोबारा चलाने से पहले कितना इंतज़ार करना है (सेकंड में)
    dependencies: { // सुनिश्चित करें कि ये पैकेज इंस्टॉल हैं
        "path": "",
        "fs-extra": "",
        "node-gtts": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        // चेक करें कि यूजर ने कोई टेक्स्ट दिया है या नहीं
        if (args.length === 0 && event.type !== "message_reply") {
            // Mirai में api.sendMessage का उपयोग करें
            return api.sendMessage("🤔 कृपया टेक्स्ट दें जिसे आप वॉयस में बदलवाना चाहते हैं।\nउदाहरण: आपके कमांड काPrefix say hi नमस्ते बॉट\nया किसी मैसेज का रिप्लाई करके लिखें: आपके कमांड काPrefix say en", event.threadID, event.messageID);
        }

        let languageToSay = global.config.language || 'en'; // बॉट config से डिफ़ॉल्ट भाषा लें, या 'en'
        let textToSay = "";

        // gtts द्वारा सपोर्टेड भाषाएं (Mirai के लिए सामान्य)
        const supportedLanguages = ['af', 'sq', 'ar', 'bn', 'bs', 'bg', 'ca', 'zh-CN', 'zh-TW', 'hr', 'cs', 'da', 'nl', 'en', 'et', 'fil', 'fi', 'fr', 'de', 'el', 'gu', 'hif', 'hi', 'hu', 'id', 'is', 'it', 'ja', 'jw', 'kn', 'km', 'ko', 'la', 'lv', 'lt', 'ml', 'mr', 'my', 'ne', 'no', 'pl', 'pt', 'ro', 'ru', 'sr', 'si', 'sk', 'su', 'sw', 'ta', 'te', 'th', 'tl', 'tr', 'uk', 'ur', 'uz', 'vi', 'zh-CN', 'zh-TW'];

        // इनपुट पार्स करें
        const firstArg = args[0]?.toLowerCase();

        if (event.type === "message_reply") {
            // यदि रिप्लाई है, तो रिप्लाई मैसेज का टेक्स्ट लें
            textToSay = event.messageReply.body;

            // यदि रिप्लाई के साथ कमांड में पहला आर्गुमेंट भाषा कोड है, तो उसे उपयोग करें
            if (args.length > 0 && supportedLanguages.includes(firstArg)) {
                languageToSay = firstArg;
                // इस मामले में textToSay पहले ही event.messageReply.body पर सेट है
                // args में केवल वह टेक्स्ट होता है जो रिप्लाई के साथ टाइप किया गया है, इसलिए args.slice(1).join(" ") का उपयोग नहीं करेंगे
            } else {
                // रिप्लाई होने पर args से भाषा कोड नहीं मिला, डिफ़ॉल्ट भाषा उपयोग होगी
            }

            // सुनिश्चित करें कि रिप्लाई मैसेज में टेक्स्ट था
            if (!textToSay || textToSay.trim().length === 0) {
                 return api.sendMessage("🤷‍♀️ रिप्लाई मैसेज में कोई टेक्स्ट नहीं है जिसे वॉयस में बदल सकूं।", event.threadID, event.messageID);
            }

        } else {
            // यदि रिप्लाई नहीं है
            if (args.length > 1 && supportedLanguages.includes(firstArg)) {
                // यदि पहला आर्गुमेंट भाषा कोड है और उसके बाद टेक्स्ट है
                languageToSay = firstArg;
                textToSay = args.slice(1).join(" "); // भाषा कोड के बाद का टेक्स्ट लें
            } else {
                // यदि पहला आर्गुमेंट भाषा कोड नहीं है, या सिर्फ एक आर्गुमेंट है, तो पूरा टेक्स्ट लें
                textToSay = args.join(" "); // पूरा टेक्स्ट TTS के लिए है
                // भाषा डिफ़ॉल्ट रहेगी
            }

            // सुनिश्चित करें कि डायरेक्ट इनपुट में टेक्स्ट था
            if (!textToSay || textToSay.trim().length === 0) {
                return api.sendMessage("💬 कृपया टेक्स्ट दें जिसे आप वॉयस में बदलवाना चाहते हैं।", event.threadID, event.messageID);
            }
        }

        // ऑडियो फाइल के लिए एक टेम्परेरी पाथ Mirai के cache फोल्डर में
        // Mirai में global.cachePath उपलब्ध हो सकता है, या __dirname/cache उपयोग करें
        const cacheFolder = path.join(__dirname, 'cache'); // कमांड फाइल के पास cache फोल्डर
        // alternative: const cacheFolder = global.cachePath || path.join(__dirname, 'cache');
        const audioFilePath = path.join(cacheFolder, `${event.threadID}_${event.senderID}_${Date.now()}.mp3`);

        // cache डायरेक्टरी मौजूद है या नहीं, चेक करें और बनाएं (fs-extra)
        await fs.ensureDir(cacheFolder);

        // Mirai api.sendTypingMgs का उपयोग करके टाइपिंग इंडिकेटर दिखाएं (वैकल्पिक)
        // api.sendTypingMgs(event.threadID);


        try {
            // 1. टेक्स्ट से ऑडियो फाइल जनरेट करें using node-gtts
            await new Promise((resolve, reject) => {
                const gttsStream = gtts.stream(textToSay, languageToSay); // भाषा पास करें
                const writeStream = fs.createWriteStream(audioFilePath);

                gttsStream.pipe(writeStream);

                writeStream.on('finish', () => resolve());
                writeStream.on('error', (err) => {
                    console.error("🔴 Mirai Say Command: Write stream error:", err);
                    reject(err);
                });
                gttsStream.on('error', (err) => {
                     console.error("🔴 Mirai Say Command: gTTS stream error:", err);
                     reject(err); // gTTS से स्ट्रीमिंग के दौरान एरर हैंडल करें
                });
            });

            // 2. ऑडियो फाइल को अटैचमेंट के रूप में भेजें (Mirai Standard)
            const message = {
                attachment: fs.createReadStream(audioFilePath)
            };

            api.sendMessage(
                message,
                event.threadID,
                (err) => { // मैसेज भेजने के बाद का कॉलबैक
                    if (err) {
                        console.error("🔴 Mirai Say Command: वॉयस मैसेज भेजने में एरर:", err);
                        // वैकल्पिक: अगर वॉयс भेजने में फेल हुआ, तो टेक्स्ट मैसेज भेजें
                        api.sendMessage(`❌ सॉरी, वॉयस मैसेज भेज नहीं पाया।`, event.threadID, event.messageID);
                    } else {
                        console.log(`✅ Mirai Say Command: वॉयस मैसेज भेजा गया thread ${event.threadID} पर`);
                    }

                    // 3. टेम्परेरी ऑडियो फाइल को डिलीट करें (Mirai के लिए महत्वपूर्ण, cache साफ रखना है)
                    fs.unlink(audioFilePath, (unlinkErr) => {
                        if (unlinkErr) console.error("🔴 Mirai Say Command: टेम्प ऑडियो फाइल डिलीट करने में एरर:", unlinkErr);
                    });
                },
                event.messageID // मूल मैसेज का जवाब दें
            );

        } catch (error) {
            console.error("🔴 Mirai Say Command: वॉयस जनरेट करने या भेजने में एरर:", error);
            // अगर वॉयс जनरेट करने या भेजने में फेल हुआ, तो टेक्स्ट मैसेज भेजें
            api.sendMessage(`❌ सॉरी, आपका टेक्स्ट वॉयस में जनरेट या भेज नहीं पाया। एरर: ${error.message}`, event.threadID, event.messageID);
             // सुनिश्चित करें कि एरर होने पर भी अस्थायी फ़ाइल डिलीट करने की कोशिश हो (यदि वह बनी हो)
             if (await fs.exists(audioFilePath)) {
                 fs.unlink(audioFilePath, (unlinkErr) => {
                    if (unlinkErr) console.error("🔴 Mirai Say Command: एरर के बाद टेम्प फाइल डिलीट करने में एरर:", unlinkErr);
                 });
             }
        }
    } catch (e) {
        console.error("🔴 Mirai Say Command: कमांड चलाने में अनएक्सपेक्टेड एरर:", e);
        // Mirai api.sendMessage का उपयोग करें
        return api.sendMessage(`❌ कमांड चलाते समय एक एरर आ गई: ${e.message}`, event.threadID, event.messageID);
    }
};
