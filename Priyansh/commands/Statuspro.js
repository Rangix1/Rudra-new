const fs = require("fs");
module.exports.config = {
	name: "statuspro",
    version: "1.0.1",
	hasPermssion: 0,
	credits: "VanHung - Fixed by Arun", // Credits जैसा था वैसा ही है
	description: "Sabar karo mera net slow hai status load horha hai...", // Description थोड़ा स्पष्ट किया
	commandCategory: "no prefix",
	usages: "+status", // Usage भी अपडेट किया
    cooldowns: 5,
};

module.exports.handleEvent = function({ api, event, client, __GLOBAL }) {
	var { threadID, messageID } = event;

	// फिक्स की हुई कंडीशन: चेक करो क्या मैसेज '+status' से शुरू होता है (case-insensitive)
	if (event.body && event.body.toLowerCase().startsWith("+status")) {
		var msg = {
				body: "Sabar karo mera net slow hai status load horha hai...⌛",
			}
			api.sendMessage( msg, threadID, messageID);
    api.setMessageReaction("🍁", event.messageID, (err) => {}, true)
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {
    // run function खाली ही रहेगी क्योंकि यह event handler है
  }
