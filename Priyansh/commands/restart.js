const fs = require("fs-extra");

module.exports = {
	config: {
		name: "restart",
		version: "1.0",
		author: "Rudra", // Author set to Rudra
		countDown: 5,
		role: 2,
		shortDescription: {
			en: "Restart the bot",
		},
		longDescription: {
			en: "Restart the bot",
		},
		category: "Owner",
		guide: {
			en: "   {pn}: Restart the bot",
		}
	},

	langs: {
		en: {
			restartting: "🔄 | Restarting the bot..."
		}
	},

	onLoad: function ({ api }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;
		if (fs.existsSync(pathFile)) {
			const [tid, time] = fs.readFileSync(pathFile, "utf-8").split(" ");
			api.sendMessage(`✅ | Bot has been restarted\n⏰ | Time: ${(Date.now() - time) / 1000}s`, tid);
			fs.unlinkSync(pathFile); // Deleting the file after restart
		}
	},

	onStart: async function ({ message, event, getLang }) {
		const pathFile = `${__dirname}/tmp/restart.txt`;

		// Write thread ID and time into restart.txt
		fs.writeFileSync(pathFile, `${event.threadID} ${Date.now()}`);
		console.log("Written to restart.txt");

		// Sending restart message
		await message.reply(getLang("restartting"));

		// Debugging Process Exit
		console.log("Bot is restarting...");
		process.exit(0);
	}
};
