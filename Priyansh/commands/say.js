// Dependencies already listed in config: "path": "", "fs-extra": ""
// यह कोड Google Translate TTS API का सीधा उपयोग करता है global.utils.downloadFile के माध्यम से।
// यह पिछले वर्जन से अलग है और node-gtts लाइब्रेरी का उपयोग नहीं करता है।

module.exports.config = {
    name: "say",
    version: "1.0.3", // वर्जन अपडेट करें
    hasPermssion: 0,
    credits: "𝐏𝐫𝐢𝐲𝐚𝐧𝐬𝐡 𝐑𝐚𝐣𝐩𝐮𝐭 and Adapted", // अपना नाम लिखें और अनुकूलन का उल्लेख करें
    description: "Make the bot return Google's audio file via text in specified language.",
    commandCategory: "media",
    usages: "[lang] [Text] or reply to a message with [lang] [text (optional)]", // उपयोग का तरीका स्पष्ट करें
    // समर्थित भाषाएँ (Google Translate TTS के आधार पर): ru, en, pt, ja, tl, ko, hi
    // हरियाणवी सीधे तौर पर सपोर्ट नहीं है।
    cooldowns: 5,
    dependencies: { // सुनिश्चित करें कि ये पैकेज इंस्टॉल हैं
        "path": "",
        "fs-extra": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    try {
        // ग्लोबल node_module से आवश्यक फंक्शन्स लें
        const { createReadStream, unlinkSync, ensureDirSync } = global.nodemodule["fs-extra"]; // ensureDirSync जोड़ा
        const { resolve } = global.nodemodule["path"];

        let languageToSay = global.config.language || 'en'; // बॉट config से डिफ़ॉल्ट भाषा या 'en'
        let textToSay = "";
        const firstArg = args[0]?.toLowerCase();

        // Google Translate TTS के लिए समर्थित भाषाएँ
        // 'pr' को संभावित टाइपो मानकर 'pt' (Portuguese) में बदला गया है। 'hi' (Hindi) और 'ko' (Korean) जोड़े गए हैं।
        // हरियाणवी (Haryanvi) Google Translate TTS द्वारा सीधे समर्थित नहीं है।
        const supportedLanguages = ['ru', 'en', 'pt', 'ja', 'tl', 'ko', 'hi'];

        // इनपुट (रिप्लाई या डायरेक्ट कमांड) के आधार पर टेक्स्ट और भाषा तय करें
        if (event.type === "message_reply") {
            // यदि रिप्लाई है, तो रिप्लाई मैसेज का टेक्स्ट उपयोग करें
            textToSay = event.messageReply.body;

            // यदि रिप्लाई कमांड के साथ पहला आर्गुमेंट भाषा कोड है (जैसे /say hi के साथ रिप्लाई)
            if (args.length > 0 && supportedLanguages.includes(firstArg)) {
                 languageToSay = firstArg;
                 // ध्यान दें: रिप्लाई के साथ टाइप किया गया अतिरिक्त टेक्स्ट (args[1] और आगे) TTS कंटेंट के लिए अनदेखा किया जाएगा।
            }

            // सुनिश्चित करें कि रिप्लाई मैसेज में टेक्स्ट था
            if (!textToSay || textToSay.trim().length === 0) {
                 return api.sendMessage("🤷‍♀️ रिप्लाई मैसेज में कोई टेक्स्ट नहीं है जिसे वॉयस में बदल सकूं।", event.threadID, event.messageID);
            }

        } else { // यदि डायरेक्ट कमांड है
            // चेक करें कि पहला आर्गुमेंट समर्थित भाषा कोड है
            if (args.length > 0 && supportedLanguages.includes(firstArg)) {
                // पहला आर्गुमेंट संभावित भाषा कोड है
                // चेक करें कि भाषा कोड के बाद टेक्स्ट दिया गया है या नहीं
                if (args.length < 2) {
                    // केवल भाषा कोड दिया गया है, उसके बाद टेक्स्ट नहीं है
                    return api.sendMessage(`🤔 कृपया ${firstArg} भाषा में बोलने के लिए टेक्स्ट दें।\nउदाहरण: आपके कमांड काPrefix say ${firstArg} आपका टेक्स्ट`, event.threadID, event.messageID);
                }
                // भाषा कोड मिल गया और उसके बाद टेक्स्ट भी है
                languageToSay = firstArg;
                textToSay = args.slice(1).join(" "); // पहले आर्गुमेंट (भाषा कोड) के बाद का सारा टेक्स्ट लें
            } else {
                // पहला आर्गुमेंट भाषा कोड नहीं है (या कोई आर्गुमेंट नहीं है)।
                // मान लें कि सभी आर्गुमेंट बोलने वाला टेक्स्ट हैं।
                textToSay = args.join(" ");
                // भाषा डिफ़ॉल्ट ही रहेगी।
            }

            // सुनिश्चित करें कि पार्सिंग के बाद textToSay खाली न हो
             if (!textToSay || textToSay.trim().length === 0) {
                 // यह चेक ऊपर की लॉजिक द्वारा कवर हो जाना चाहिए, लेकिन सुरक्षा के लिए है
                return api.sendMessage("💬 कृपया टेक्स्ट दें जिसे आप वॉयस में बदलवाना चाहते हैं।", event.threadID, event.messageID);
            }
        }

        // अब textToSay में बोलने वाला टेक्स्ट और languageToSay में भाषा कोड है।

        // Mirai के cache फोल्डर में अस्थायी ऑडियो फाइल का पाथ परिभाषित करें
        // __dirname कमांड फाइल के पास का फोल्डर है।
        const cacheFolder = resolve(__dirname, 'cache');
        // कॉन्फ्लिक्ट से बचने के लिए फ़ाइल नाम में थ्रेड ID, सेंडर ID और टाइमस्टैम्प शामिल करें।
        const audioFilePath = resolve(cacheFolder, `${event.threadID}_${event.senderID}_${Date.now()}.mp3`);

        // सुनिश्चित करें कि cache डायरेक्टरी मौजूद है (Synchronously using fs-extra)
        ensureDirSync(cacheFolder); // ensureDirSync बेहतर है जब तक कि आप सुनिश्चित न हों कि आप async ensureDir का उपयोग await के साथ सही कर रहे हैं।


        // Google Translate TTS URL बनाएं
        // encodeURIComponent का उपयोग करें ताकि टेक्स्ट में स्पेशल कैरेक्टर URL को खराब न करें।
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(textToSay)}&tl=${languageToSay}&client=tw-ob`;

        // बॉट के ग्लोबल यूटिलिटी फंक्शन का उपयोग करके ऑडियो फाइल डाउनलोड करें
        // यह अपेक्षित है कि आपके बॉट के global.utils में downloadFile फंक्शन मौजूद हो।
        await global.utils.downloadFile(ttsUrl, audioFilePath);

        // ऑडियो फाइल को मैसेज अटैचमेंट के रूप में भेजें
        api.sendMessage({
            body: "", // वॉयस मैसेज के साथ वैकल्पिक कैप्शन टेक्स्ट
            attachment: createReadStream(audioFilePath) // फ़ाइल को पठनीय स्ट्रीम के रूप में अटैच करें
        }, event.threadID, (err) => {
            // मैसेज भेजने के बाद का कॉलबैक फंक्शन
            if (err) {
                console.error("🔴 Mirai Say Command (Google TTS): वॉयस मैसेज भेजने में एरर:", err);
                api.sendMessage(`❌ सॉरी, वॉयस मैसेज भेज नहीं पाया।`, event.threadID, event.messageID);
            } else {
                 console.log(`✅ Mirai Say Command (Google TTS): वॉयस मैसेज भेजा गया thread ${event.threadID} पर`);
            }

            // मैसेज भेजने के बाद अस्थायी ऑडियो फाइल को डिलीट करें
            try {
                 unlinkSync(audioFilePath); // Synchonously unlink the file
            } catch (unlinkErr) {
                 console.error("🔴 Mirai Say Command (Google TTS): टेम्प फाइल डिलीट करने में एरर:", unlinkErr);
            }
        }, event.messageID); // मूल मैसेज का जवाब दें (वैकल्पिक)


    } catch (e) {
        // प्रक्रिया के दौरान कोई भी एरर पकड़ें (पार्सिंग, डाउनलोड, भेजना)
        console.error("🔴 Mirai Say Command (Google TTS): कमांड चलाने में एरर:", e);
        // यूजर को एरर के बारे में बताएं
        return api.sendMessage(`❌ कमांड चलाते समय एक एरर आ गई: ${e.message}`, event.threadID, event.messageID);
        // यदि डाउनलोड फेल होता है, तो फ़ाइल मौजूद नहीं होगी, इसलिए डिलीट की आवश्यकता नहीं है।
        // यदि आंशिक डाउनलोड हुआ और एरर आई, तो उसे डिलीट करना मुश्किल हो सकता है इस catch ब्लॉक से।
        // ऊपर sendMeessage callback में unlinkSync अधिकांश मामलों को संभालता है।
    }
};
