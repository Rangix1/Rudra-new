module.exports.config = {
  name: "advhack",
  version: "1.2", // Version updated
  hasPermssion: 0,
  credits: "Mohit x Rudra & Modified by Your AI", // Added modification credit
  description: "Mention pe hacking animation jo bilkul real aur tez lage", // Updated description
  commandCategory: "fun",
  usages: "@user",
  cooldowns: 10, // Increased cooldown for a longer simulation
};

const adminUID = "61550558518720"; // Replace with the actual admin UID

// Extended list of more diverse and faster-paced hacking simulation messages
const hackingAnimations = [
  "[ INIT ] Initializing secure encrypted channel...",
  "[ SCAN ] Scanning target subnet 192.168.1.0/24 for active hosts...",
  "[ TARGET FOUND ] Host 192.168.1.105 identified: Device Type - Mobile.",
  "[ PORT SCAN ] Scanning open ports on 192.168.1.105...",
  "[ PORT 22 ] SSH port open. Attempting dictionary attack...",
  "[ PORT 8080 ] Web service detected. Searching for CVEs...",
  "[ PORT 443 ] HTTPS open. Initiating Man-in-the-Middle attack simulation...",
  "[ ENUMERATING ] Listing user accounts and groups...",
  "[ BRUTE FORCE ] Trying common passwords against SSH...",
  "[ EXPLOIT ] Found vulnerability in web service (CVE-2023-xxxx).",
  "[ INJECTING ] Payload: Meterpreter reverse shell...",
  "[ ░░░░░░░░░░░ ] Establishing foothold...",
  "[ ██░░░░░░░░░ ] Gained low-level user access.",
  "[ PRIVILEGE ESCALATION ] Attempting Kernel exploit...",
  "[ ██████░░░░░ ] Succeeded! Root access acquired!",
  "[ root@target ] Shell access granted.",
  "[ FILESYSTEM ] Navigating to sensitive directories...",
  "[ /data/data/com.app.private/databases/ ] Accessing app data...",
  "[ DOWNLOADING ] chats.db (15.2 MB)...",
  "[ DOWNLOADING ] images.zip (45.1 MB)...",
  "[ SEARCHING ] for keywords: password, secret, bank, crypto...",
  "[ FOUND ] Potential sensitive document: notes.txt",
  "[ COPYING ] notes.txt to remote staging server...",
  "[ INJECTING ] Persistent backdoor via startup service...",
  "[ ESTABLISHING ] Covert channel over ICMP...",
  "[ CLEANING LOGS ] Deleting authentication logs and command history...",
  "[ REMOVING TRACES ] Wiping temporary files and shell footprints...",
  "[ ░░░░░░░░░░░ ] Obfuscating network traffic source...",
  "[ ████░░░░░░░ ] Encrypting exfiltrated data before transfer.",
  "[ ███████░░░░ ] Data exfiltration in progress...",
  "[ ████████████ ] Data exfiltration complete. Total: 88.9 MB.",
  "[ DISCONNECTING ] Terminating all active malicious sessions...",
  "[ STATUS ] Intrusion Detection System evasion successful.",
  "[ REPORT ] All security measures bypassed.",
  "[ SYSTEM MESSAGE ] Target system is fully compromised and persistent access established.",
  "[ WARNING ] High CPU usage detected by target monitoring...",
  "[ ERROR ] Connection lost to secondary C2 server. Reconnecting...",
  "[ INITIATING ] Ransomware encryption simulation...",
  "[ BYPASSING ] Two-factor authentication via token replay...",
  "[ ACCESSING ] Cloud storage synchronization folder...",
  "[ COMPROMISED ] Email account credentials harvested.",
  "[ DATA DUMP ] Initiated for contact list.",
  "[ ACTIVATING ] Remote microphone tap...",
  "[ KEYLOGGER ] Capturing keystrokes in real-time...",
  "[ PROCESS INJECTION ] Injecting malicious code into system process PID 4567...",
  "[ FIREWALL ] Adding rule to allow incoming connections...",
  "[ DATA COMPRESSION ] Compressing /storage/emulated/0/documents/... (ETA 2 min)",
  "[ ESTABLISHING ] Tunnel via Tor network...",
  "[ SEARCHING ] for cached passwords in browser data...",
  "[ DECRYPTING ] Encrypted storage partition keys...",
  "[ ALERT BYPASSED ] SMS verification code intercepted.",
  "[ EXFILTRATING ] Encrypted archive via covert channel...",
  "[ COMMAND ] Executing command: `ls -la /root`",
  "[ COMMAND ] Executing command: `cat /etc/passwd`",
  "[ STATUS ] Antivirus software disabled.",
  "[ CLEANUP ] Removing implanted files and scripts.",
  "[ FINALIZING ] Ensuring persistence through multiple vectors.",
  "[ 100% COMPLETE ] Primary objective achieved. Shutting down non-essential modules.",
  "[ SESSION TERMINATED ] All connections closed. Exiting.",
  "[ Stealth Status ] No unusual activity detected by target system.",
  "[ Log ] Operation successful."
];


module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  // Admin check
  if (senderID !== adminUID) {
    return api.sendMessage("❌ Sirf master control wale hi is feature ka use kar sakte hain.", threadID, messageID);
  }

  // Mention check
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ Mention karo kisko hack dikhana hai!", threadID, messageID);
  }

  // Get target info
  const targetName = Object.values(mentions)[0].replace(/@/g, ""); // Remove @ from name
  const targetUID = Object.keys(mentions)[0];

  // Initial message
  api.sendMessage(`⚠️ Hacking simulation activated for ${targetName} [UID: ${targetUID}]\nInitiating 10-minute mock intrusion sequence...`, threadID, messageID);

  let count = 0;
  // Faster interval for more frequent messages
  const intervalTime = 2500; // Send a message every 2.5 seconds
  // Calculate max messages for ~10 minutes
  const durationMinutes = 10;
  const totalSeconds = durationMinutes * 60;
  const maxMessages = Math.floor(totalSeconds / (intervalTime / 1000)); // 600 seconds / 2.5 seconds/message = 240 messages

  const interval = setInterval(() => {
    // Select a random message from the improved list
    const msg = hackingAnimations[Math.floor(Math.random() * hackingAnimations.length)];

    // Send the message including target info
    api.sendMessage(`[ TARGET: ${targetName.toUpperCase()} ] ${msg}`, threadID);

    count++;
    // Clear the interval after the calculated number of messages for 10 minutes
    if (count >= maxMessages) {
      clearInterval(interval);
      api.sendMessage(`✅ Simulation complete for ${targetName}. Operation finalized and stealth maintained.`, threadID);
    }
  }, intervalTime); // Interval in milliseconds
};
