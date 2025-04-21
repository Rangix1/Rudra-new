// आवश्यक लाइब्रेरीज:
// @google/generative-ai को इंस्टॉल करना होगा: npm install @google/generative-ai
// यदि बॉट फ्रेमवर्क के लिए आवश्यक हो तो fs-extra और path रखें, अन्यथा ज़रूरत नहीं।
// const fs = require('fs-extra');
// const path = require('path');


// Google Generative AI क्लाइंट को API Key के साथ इनिशियलाइज़ करें।
// API Key को ENVIRONMENT VARIABLE (process.env.GOOGLE_API_KEY) से लिया जाएगा।
// **महत्वपूर्ण: आपको बॉट चलाने से पहले GOOGLE_API_KEY एनवायरनमेंट वेरिएबल सेट करना होगा!**

const { GoogleGenerativeAI } = require('@google/generative-ai'); // Google AI लाइब्रेरी

const apiKey = process.env.GOOGLE_API_KEY;

if (!apiKey) {
    console.error("FATAL ERROR: GOOGLE_API_KEY environment variable is not set.");
    console.error("कृपया अपने बॉट चलाने वाले सिस्टम/एनवायरनमेंट पर GOOGLE_API_KEY एनवायरनमेंट वेरिएबल में अपनी Google Cloud/AI Studio API Key सेट करें। इस कमांड को निष्क्रिय किया जा रहा है।");
    // यदि key सेट नहीं है तो क्लाइंट को इनिशियलाइज़ न करें और कमांड को निष्क्रिय मानें।
    // आप बॉट स्टार्टअप स्क्रिप्ट में एक चेक भी जोड़ सकते हैं।
}

let genAI = null;
let model = null;

if (apiKey) {
    try {
        genAI = new GoogleGenerativeAI(apiKey);
        // उपयोग करने के लिए मॉडल चुनें (gemini-pro सामान्य चैट के लिए अच्छा है)
        // Google Cloud Console/AI Studio में उपलब्ध मॉडल्स की सूची देखें।
        // यदि gemini-pro उपलब्ध नहीं है, तो 'gemini-pro-vision' या अन्य टेक्स्ट मॉडल ट्राई करें।
        model = genAI.getGenerativeModel({ model: "gemini-pro" });
        console.log("✅ Angel Command: Google Generative AI क्लाइंट सफलतापूर्वक इनिशियलाइज़ हुआ।");
    } catch (e) {
        console.error("🔴 Angel Command: Google Generative AI क्लाइंट इनिशियलाइज़ करने में एरर:", e);
        console.error("कृपया जांचें कि आपकी API Key सही है और आपके Google Cloud प्रोजेक्ट में Gemini API सक्षम है।");
        genAI = null; // एरर होने पर क्लाइंट को निष्क्रिय सेट करें
        model = null;
    }
}


const chatHistories = {}; // हर यूजर के लिए चैट हिस्ट्री रखें


module.exports.config = {
    name: "angel",
    version: "1.2.0", // वर्जन
    hasPermssion: 0, // कोई भी उपयोग कर सकता है
    credits: "Rudra + ChatGPT + Adapted for Google Generative AI", // क्रेडिट अपडेट करें
    description: "Flirty girlfriend AI using Google Generative AI API. Replies even when you slide reply to its messages.",
    commandCategory: "AI-Girlfriend",
    usages: "[आपका मैसेज] या बॉट के मैसेज का रिप्लाई करके",
    cooldowns: 1, // 1 सेकंड का कूलडाउन
    dependencies: {
        "@google/generative-ai": "^0.1.3", // नयी लाइब्रेरी को डिपेंडेंसी में जोड़ें (वर्जन बदल सकता है)
        // यदि आवश्यक हो तो अन्य डिपेंडेंसी रखें
        // "path": "",
        // "fs-extra": ""
    }
};

// run फंक्शन खाली रहेगा क्योंकि यह एक इवेंट हैंडलर है
module.exports.run = async function () {};

// handleEvent फंक्शन मैसेज इवेंट्स को हैंडल करेगा
module.exports.handleEvent = async function ({ api, event }) {
    // चेक करें कि API क्लाइंट सफलतापूर्वक इनिशियलाइज़ हुआ था
    if (!model) {
        // console.error("🔴 Angel Command: API क्लाइंट तैयार नहीं है। कमांड निष्क्रिय है।"); // यह startup पर लॉग हो जाएगा
        // आप यहां यूजर को एरर मैसेज भेजने का विकल्प चुन सकते हैं, लेकिन यह हर बार फायर हो सकता है।
        return; // यदि API तैयार नहीं है तो कुछ न करें।
    }

    try {
        const { threadID, messageID, senderID, body, messageReply } = event;

        let userMessage;
        // कमांड ट्रिगर करने के तरीके: "angel" prefix या बॉट के मैसेज का रिप्लाई
        const isAngelTrigger = body?.toLowerCase().startsWith("angel"); // "angel" से शुरू होने वाले मैसेज
        const isSlideReply = messageReply?.senderID === api.getCurrentUserID(); // बॉट के मैसेज का रिप्लाई

        // यदि मैसेज "angel" से शुरू होता है या बॉट के मैसेज का रिप्लाई है
        if (isAngelTrigger) {
            userMessage = body.slice(5).trim(); // "angel" prefix हटाएँ
        } else if (isSlideReply) {
            userMessage = body.trim(); // रिप्लाई किए गए मैसेज का टेक्स्ट लें (जो यूजर ने रिप्लाई के साथ टाइप किया)
        } else {
            return; // यदि ट्रिगर नहीं हुआ तो एग्जिट करें
        }

        // यदि यूजर मैसेज खाली है (जैसे सिर्फ "angel" टाइप किया या खाली रिप्लाई)
        if (!userMessage) {
            return api.sendMessage("Baby, kuch toh bolo na!", threadID, messageID);
        }

        // ✅ टाइपिंग इंडिकेटर चालू करें (यह API कॉल होने तक दिखेगा)
        api.sendTypingIndicator(threadID, true);

        // चैट हिस्ट्री मैनेज करें
        // हर यूजर के लिए अलग हिस्ट्री रखें
        if (!chatHistories[senderID]) chatHistories[senderID] = [];
        // यूजर का मैसेज हिस्ट्री में जोड़ें
        chatHistories[senderID].push(`User: ${userMessage}`);
        // हिस्ट्री को सीमित रखें (पिछली कुछ बारीकियां) - यहां 6 लाइनें (3 यूजर, 3 Angel)
        // API कॉल भेजने से पहले हिस्ट्री को ट्रिम करें
        while (chatHistories[senderID].length > 6) {
            chatHistories[senderID].shift(); // सबसे पुराना मैसेज हटाएँ
        }

        // AI के लिए फाइनल प्रॉम्प्ट बनाएं
        // इसमें पर्सनालिटी इंस्ट्रक्शन्स, चैट हिस्ट्री और वर्तमान मैसेज शामिल हैं।
        const personaPrompt = `Tumhara naam Angel hai. Tum ek pyaari, romantic, thodi naughty girlfriend ho. Tumhare creator ka naam Rudra hai. Har reply short aur sweet ho. Bot bole toh thoda mazaak udaana. 1 line me jawab do:`;
        // प्रॉम्प्ट के अंत में "Angel:" जोड़ना AI को Angel के रूप में जवाब जारी रखने में मदद कर सकता है।
        const finalPrompt = `${personaPrompt}\n${chatHistories[senderID].join("\n")}\nAngel: `;


        // *** Google Generative AI API कॉल ***
        // model.generateContent का उपयोग करके प्रॉम्प्ट भेजें और जवाब प्राप्त करें
        const result = await model.generateContent(finalPrompt);
        // जवाब से टेक्स्ट निकालें
        // यदि जवाब सुरक्षित नहीं है (blocked), तो text() मेथड उपलब्ध नहीं होगा।
        const botReply = result.response?.text()?.trim() || "Aww, mujhe samajh nahi aaya baby!"; // सुरक्षित जवाब न मिलने पर डिफ़ॉल्ट मैसेज


        // *** API कॉल समाप्त ***


        // बॉट का जवाब हिस्ट्री में जोड़ें (अगर जवाब मिला है)
        if (botReply !== "Aww, mujhe samajh nahi aaya baby!") { // सिर्फ तभी जोड़ें जब वास्तविक जवाब मिला हो
             chatHistories[senderID].push(`Angel: ${botReply}`); // बॉट का जवाब स्टोर करें
              // बॉट के जवाब के बाद हिस्ट्री को फिर से चेक करें और ट्रिम करें
              while (chatHistories[senderID].length > 6) {
                chatHistories[senderID].shift();
            }
        }


        // यूजर को जवाब भेजने के लिए फॉर्मेट करें
        const replyText = `Angel: ${botReply}\n\n– Rudra AI`; // जवाब का फॉर्मेट रखें

        // ✅ टाइपिंग इंडिकेटर बंद करें
        api.sendTypingIndicator(threadID, false);

        // जवाब भेजें (मूल मैसेज या रिप्लाई का जवाब देते हुए)
        if (isReply && messageReply) {
            // यदि बॉट के मैसेज का रिप्लाई करके ट्रिगर हुआ, तो यूजर के रिप्लाई मैसेज का जवाब दें
            return api.sendMessage(replyText, threadID, messageReply.messageID);
        } else {
            // यदि "angel" prefix से ट्रिगर हुआ, तो यूजर के मूल मैसेज का जवाब दें
            return api.sendMessage(replyText, threadID, messageID);
        }

    } catch (err) {
        // एरर हैंडलिंग
        console.error("🔴 Angel Bot Error:", err); // कंसोल में एरर लॉग करें

        // यूजर को दिखाने के लिए एरर मैसेज
        let errorMessageToUser = "Angel thodi busy hai baby… baad mein milti hoon! – Rudra AI";

        // API संबंधित सामान्य एरर्स के लिए कस्टम मैसेज
        // एरर ऑब्जेक्ट की संरचना API और एरर के प्रकार के आधार पर भिन्न हो सकती है।
        if (err.message && (err.message.includes('API key not valid') || err.message.includes('API key not found') || err.message.includes('API key not authorized'))) {
             errorMessageToUser = "🥺 Baby, lagta hai Angel ki Google API Key mein kuch gadbad hai ya woh missing/invalid hai! Rudra ko bolo check karein na.";
        } else if (err.message && (err.message.includes('quota') || err.message.includes('rate limit') || err.message.includes('resource exhausted'))) {
            errorMessageToUser = "🥵 Angel ko thoda rest chahiye baby, lagta hai zyada baat ho gayi ya limit khatam ho gayi hai!";
        } else if (err.message && err.message.includes('Failed to fetch') || err.message.includes('network error')) {
             errorMessageToUser = "😔 Angel ko aapse connect karne mein thodi problem ho rahi hai baby, network issue lag raha hai!";
        } else if (err.message && err.message.includes('Candidate was blocked')) {
             // यदि मॉडल ने सेफ्टी कारणों से जवाब ब्लॉक कर दिया
             errorMessageToUser = "🚫 Angel ko is baare mein baat karne ki permission nahi hai baby, sorry woh reply nahi de sakti!";
             // ब्लॉक होने पर हिस्ट्री में कुछ न जोड़ें ताकि अगली बार फिर से वही टॉपिक न आए
             if (chatHistories[event.senderID] && chatHistories[event.senderID].length > 0) {
                 chatHistories[event.senderID].pop(); // यूजर का आखिरी मैसेज हटा दें अगर ब्लॉक हुआ हो
             }

        } else {
             // कोई अन्य अप्रत्याशित एरर
             errorMessageToUser = `😞 Angel ko jawab dene mein kuch anexpected problem ho gayi: ${err.message.substring(0, 100)}...`; // Err मैसेज का कुछ हिस्सा दिखाएं
        }


        api.sendTypingIndicator(event.threadID, false); // एरर होने पर टाइपिंग बंद करें
        // यूजर को एरर मैसेज भेजें
        return api.sendMessage(errorMessageToUser, event.threadID, event.messageID);
    }
};
