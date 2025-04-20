module.exports.config = {
  name: "advhack",
  version: "1.4", // Version updated
  hasPermssion: 0,
  credits: "Mohit x Rudra & Modified by Your AI (Prank Mode)", // Added modification credit and prank context
  description: "Mention pe hacking animation designed to look like real scary coding with guaranteed progress updates every 15s.", // Updated description
  commandCategory: "fun",
  usages: "@user",
  cooldowns: 15, // Increased cooldown
};

const adminUID = "61550558518720"; // Replace with the actual admin UID

// --- DISCLAIMER ---
// THIS IS PURELY A TEXT-BASED SIMULATION FOR PRANK PURPOSES.
// IT DOES NOT PERFORM ANY ACTUAL HACKING, ACCESS ANY DATA,
// OR HARM ANY DEVICE OR USER. IT ONLY MIMICS THE APPEARANCE
// OF HACKING ACTIVITY THROUGH CONSOLE-LIKE TEXT OUTPUT.
// --- END DISCLAIMER ---

// Separate list for general hacking simulation messages (excluding progress bars)
const generalAnimations = [
    "[ SYSINIT ] Initiating secure encrypted channel...",
    "[ NETWORK ] Scanning target subnet 192.168.1.0/24... Done.",
    "[ TARGET ID ] Host found: 192.168.1.105 - Device: Android Mobile",
    "[ PORT SCAN ] Checking open ports on 192.168.1.105...",
    "  -> PORT 22 (SSH): OPEN",
    "  -> PORT 80 (HTTP): OPEN",
    "  -> PORT 443 (HTTPS): FILTERED",
    "  -> PORT 8080 (HTTP-Proxy): OPEN",
    "[ VULN SCAN ] Running automated vulnerability assessment...",
    "[ INFO ] Detected potential weak points on port 8080 (Proxy).",
    "[ EXPLOIT ] Loading exploit module: 'ProxyShell.py'",
    "[ ATTACK ] Executing exploit against 192.168.1.105:8080...",
    "[ STATUS ] Shell access acquired!",
    "[ SHELL ] root@target:~#",
    "[ CMD ] cat /etc/passwd",
    "root:x:0:0:root:/root:/bin/bash",
    "user:x:1000:1000::/home/user:/bin/bash",
    "[ CMD ] ls -la /home/user/",
    "drwxr-xr-x 5 user user 4096 Apr 21 00:30 .",
    "-rw------- 1 user user 1234 Apr 21 00:25 .ssh/id_rsa", // SCARY FILE
    "-rw-r--r-- 1 user user 5678 Apr 20 18:00 Documents/passwords.txt", // SCARY FILE
    "[ DATA ] Analyzing extracted data...",
    "[ EXTRACT ] Found 15 sets of login credentials.",
    "[ INJECT ] Deploying persistence mechanism: backdoor.sh @ /etc/init.d/",
    "[ PERSIST ] Adding startup script...",
    "[ NETWORK ] Setting up covert channel via DNS TXT records...",
    "[ MONITOR ] Activating keylogger and screen capture.",
    "[ CAPTURE ] Grabbing current screen buffer...",
    "[ LOGS ] Wiping system logs and shell history...",
    "[ CLEANUP ] Removing temporary files from /tmp",
    "[ STEALTH ] Obfuscating process names and network traffic.",
    "[ STATUS ] All primary objectives achieved.",
    "[ FINALIZING ] Verifying backdoor access...",
    "[ VERIFIED ] Persistent root access confirmed.",
    "[ WARNING ] User activity detected. Minimizing footprint.",
    "[ ERROR ] Failed to wipe audit logs. Manual cleanup required.",
    "[ RETRY ] Attempting log wipe using alternative method...",
    "[ SUCCESS ] Audit logs successfully cleared.",
    "[ SYSTEM ] Disconnecting all external sessions.",
    "[ COMPLETE ] Operation finished. Exiting system processes.",
    "[ STATUS ] Leaving no detectable traces.",
    "[ REPORT ] Target system: COMPROMISED. Data: EXFILTRATED. Persistence: ESTABLISHED.",
    "[ SESSION ] Closing encrypted tunnel.",
    "[ SHUTDOWN ] Core modules offline.",
    "[ IDLE ] Waiting for next command...",
    "[ ALERT BYPASS ] Security software heuristics evaded.",
    "[ DATA DUMP ] Dumping Browse history...",
    "[ ACCESS ] Gained access to internal storage.",
    "[ DECRYPT ] Attempting to decrypt encrypted files...",
    "[ FINANCIAL ] Scanning for banking app data.",
    "[ CAMERA ] Activating front camera stream...",
    "[ MICROPHONE ] Initializing audio capture...",
    "[ GEOLOCATION ] Tracking target's real-time location.",
    "[ COMMAND ] Executing `reboot` command as a diversion. (Simulation Only)", // Potentially scary
    "[ ERROR ] Permission denied to execute reboot. Access level insufficient.", // Countering scary with failed action
    "[ STATUS ] Full control maintained.",
    "[ ARTIFACTS ] Deleting exploit remnants.",
    "[ COVERT ] Hiding network connections.",
    "[ ZOMBIE ] Adding target device to botnet.",
    "[ SUCCESS ] Target is now a zombie node.",
    "[ FILE ACCESS ] Reading contents of clipboard.",
    "[ SNIFFING ] Capturing local network packets.",
    "[ MALWARE ] Injecting banking Trojan...",
    "[ PHISHING ] Setting up fake login page on local network.",
    "[ WIPING ] Formatting SD card... (Simulation Only)", // Make it clear it's simulation
    "[ IMPORTANT ] Simulation: Formatting not actually happening.", // Reinforce simulation
    "[ FAKE ] Initiating self-destruct sequence... (Simulation Only)", // Prank level high
    "[ FAKE ] Countdown: 10... 9... 8...", // Prank countdown
    "[ FAKE ] Simulation Aborted: Self-destruct cancelled.", // Prank ending
    "[ PROCESS LIST ] Analyzing running processes...",
    "[ SUSPICIOUS ] Found unknown process PID 9999...",
    "[ KILLING ] Terminating suspicious process...",
    "[ LOG ] Connection established from unknown IP 203.0.113.12.",
    "[ UPLOAD ] Uploading encrypted payload...",
    "[ CHECK ] Verifying integrity of exfiltrated data.",
    "[ SYSTEM ALERT ] Low disk space on target (Simulation).",
    "[ PROXY ] Bypassing geo-restrictions via proxy chain.",
    "[ ROOTKIT ] Installing kernel-level rootkit for deep access.",
    "[ STATUS ] Rootkit installation complete.",
    "[ RECON ] Mapping internal network topology.",
    "[ PIVOT ] Pivoting to internal network segment.",
    "[ DATA CORRUPT ] Simulating data corruption on non-critical files.", // Add scary elements
    "[ WARNING ] Critical system file modification failed (Simulation).", // Keep it safe
    "[ SUCCESS ] Non-critical data corrupted.",
    "[ FINAL ] Simulation complete. All simulated actions finalized."
];

// Separate list specifically for progress bar messages
const progressBarAnimations = [
  "[ DOWNLOAD ] Downloading /home/user/data.zip...",
  "[ UPLOAD ] Uploading results to C2 server...",
  "[ ENCRYPT ] Encrypting user data...",
  "[ DECRYPT ] Decrypting encrypted volume...",
  "[ TRANSFER ] Transferring sensitive files...",
  "[ PROGRESS ] [██░░░░░░░░░] 20%",
  "[ PROGRESS ] [████░░░░░░░] 40%",
  "[ PROGRESS ] [██████░░░░░] 60%",
  "[ PROGRESS ] [████████░░░] 80%",
  "[ PROGRESS ] [██████████░] 90%",
  "[ PROGRESS ] [███████████] 99%", // Near completion
  "[ DOWNLOAD ] Downloading config files...",
  "[ UPLOAD ] Uploading screenshots...",
  "[ TRANSFER ] Transferring database dump...",
  "[ PROGRESS ] [░░░░░░░░░░░] 5%", // Start
  "[ PROGRESS ] [████████████] 100% Complete." // Completion message
];


module.exports.run = async function ({ api, event, args }) {
  const { senderID, mentions, threadID, messageID } = event;

  // Admin check - Ensure only specific user can trigger this prank
  if (senderID !== adminUID) {
    return api.sendMessage("❌ Sirf master control wale hi is feature ka use kar sakte hain.", threadID, messageID);
  }

  // Mention check - Make sure someone is mentioned for the prank target
  if (Object.keys(mentions).length === 0) {
    return api.sendMessage("⚠️ Mention karo kisko hack dikhana hai! (Prank ke liye)", threadID, messageID);
  }

  // Get target info
  const targetName = Object.values(mentions)[0].replace(/@/g, ""); // Clean the name
  const targetUID = Object.keys(mentions)[0]; // Get the target's UID

  // Initial prank message - Set the stage
  api.sendMessage(`⚠️ Initiating high-level intrusion simulation on target: ${targetName} [UID: ${targetUID}]\nThis is a simulated operation for testing purposes. Duration: 10 minutes.`, threadID, messageID);

  let count = 0; // Counter for overall messages
  // Interval for general messages (faster)
  const generalIntervalTime = 1500; // Send a message every 1.5 seconds
  // Interval for progress bar messages (every 15 seconds as requested)
  const progressBarIntervalTime = 15000; // Send a progress message every 15 seconds

  const durationMinutes = 10;
  const totalSeconds = durationMinutes * 60;
  // Calculate total messages needed for general interval to run for ~10 minutes
  const maxMessages = Math.ceil(totalSeconds / (generalIntervalTime / 1000)); // 600 seconds / 1.5 seconds/message = 400 messages

  // Variables to store interval IDs so we can stop them later
  let generalIntervalId;
  let progressIntervalId;

  // --- Start the MAIN interval for General Animation Messages ---
  generalIntervalId = setInterval(() => {
    // Check if total duration is reached
    if (count >= maxMessages) {
      // Clear both intervals
      clearInterval(generalIntervalId);
      clearInterval(progressIntervalId);
      // Send final message (will be sent by only one of the intervals when condition met)
       api.sendMessage(`✅ Simulation for target ${targetName} complete. All simulated processes terminated safely. This operation was for testing purposes only.`, threadID);
      return; // Stop further execution in this interval tick
    }

    // Pick a random message from the general list
    const msg = generalAnimations[Math.floor(Math.random() * generalAnimations.length)];

    // Send the message with a console-like prefix
    api.sendMessage(`[ SYSTEM ] ${msg}`, threadID);

    count++; // Increment the overall message counter

  }, generalIntervalTime); // Interval in milliseconds

  // --- Start the SECONDARY interval for Progress Bar Messages ---
  progressIntervalId = setInterval(() => {
     // Check if total duration is reached
     if (count >= maxMessages) { // Use the same total count to stop
        clearInterval(generalIntervalId); // Clear the first interval too
        clearInterval(progressIntervalId);
         // Final message will be handled by the other interval when it hits maxMessages
         // Avoid sending the final message twice
        return; // Stop further execution in this interval tick
      }

    // Pick a random message from the progress bar list
    const msg = progressBarAnimations[Math.floor(Math.random() * progressBarAnimations.length)];

    // Send the progress message with a specific prefix
    api.sendMessage(`[ PROGRESS ] ${msg}`, threadID);

    // Note: We don't increment `count` here because `maxMessages` is based on the generalIntervalTime.
    // The total time is controlled by the faster general interval's count.

  }, progressBarIntervalTime); // Interval in milliseconds

  // Initial check in case duration is somehow 0 (unlikely with 10 mins)
   if (maxMessages <= 0) {
       api.sendMessage(`✅ Simulation for target ${targetName} complete. All simulated processes terminated safely. This operation was for testing purposes only.`, threadID);
   }
};
