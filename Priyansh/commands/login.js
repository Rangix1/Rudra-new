const fs = require("fs");
const login = require("fca-unofficial");

module.exports.config = {
  name: "login",
  version: "1.0.1",
  hasPermssion: 2, // Sirf admin
  credits: "Rudra",
  description: "Step-by-step FB login via Messenger",
  commandCategory: "System",
  usages: "login",
  cooldowns: 5
};

const waitingUsers = {};

module.exports.run = async function({ api, event }) {
  const { senderID, threadID, messageID } = event;
  waitingUsers[senderID] = { step: 1, data: {} };
  return api.sendMessage("📧 Pehle apna *Facebook email ya number* bhejo:", threadID, messageID);
};

module.exports.handleReply = async function({ api, event }) {
  const { senderID, body, threadID, messageID } = event;
  if (!waitingUsers[senderID]) return;

  const userState = waitingUsers[senderID];

  if (userState.step === 1) {
    userState.data.email = body.trim();
    userState.step = 2;
    return api.sendMessage("🔑 Ab apna *password* bhejo:", threadID, messageID);
  }

  if (userState.step === 2) {
    const email = userState.data.email;
    const password = body.trim();
    delete waitingUsers[senderID];

    api.sendMessage("⏳ Login kar raha hoon, ruk jao zara...", threadID);

    login({ email, password }, (err, apiLogin) => {
      if (err) {
        const msg = err?.error || JSON.stringify(err);
        if (msg.toLowerCase().includes("login-approval")) {
          return api.sendMessage("❌ 2FA active hai! Disable karo aur dobara try karo.", threadID);
        }
        return api.sendMessage("❌ Login failed: " + msg, threadID);
      }

      fs.writeFileSync("appstate.json", JSON.stringify(apiLogin.getAppState(), null, 2));
      api.sendMessage("✅ Login successful! Cookies update ho gayi. Bot restart ho raha hai...", threadID, () => {
        process.exit(1); // Restart
      });
    });
  }
};

module.exports.handleEvent = async function({ event }) {
  if (waitingUsers[event.senderID]) {
    module.exports.handleReply(...arguments);
  }
};
