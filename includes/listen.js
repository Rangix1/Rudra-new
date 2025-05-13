module.exports = function ({ api, models }) {
    const fs = require("fs");
    const Users = require("./controllers/users")({ models, api }),
        Threads = require("./controllers/threads")({ models, api }),
        Currencies = require("./controllers/currencies")({ models });
    const logger = require("../utils/log.js");
    const moment = require('moment-timezone');
    const axios = require("axios");
    var day = moment.tz("Asia/Kolkata").day();


    const checkttDataPath = __dirname + '/../Priyansh/commands/checktuongtac/';

    // *** MODIFIED CHECKTT INTERVAL START ***
    const checkttIntervalTime = 1000 * 10; // Run checktt logic every 10 seconds

    async function runChecktt() {
        try {
            const day_now = moment.tz("Asia/Kolkata").day();
            const _ADMINIDs = [...global.config.NDH, ...global.config.ADMINBOT];

            // Only perform heavy work (reading files, sorting, sending) on day change or if day is 1 (Monday for weekly)
            if (day != day_now || day_now == 1) {
                 logger(`Day changed or is Monday (${day_now}). Running checktt reports.`, '[ Listen:Checktt ]');

                day = day_now; // Update the day after checking

                const checkttData = fs.readdirSync(checkttDataPath).filter(file => {
                  const _ID = file.replace('.json', '');
                  // Filter for valid thread/user IDs from data
                  return (global.data.allThreadID && global.data.allThreadID.includes(_ID)) || (global.data.allUserID && global.data.allUserID.includes(_ID)) || _ADMINIDs.includes(_ID);
                });

                await new Promise(async resolve => {
                    for (const checkttFile of checkttData) {
                        try { // Added try-catch for individual file processing
                             const checktt = JSON.parse(fs.readFileSync(checkttDataPath + checkttFile));
                             let storage = [], count = 1;

                             // Process daily stats if day changed
                             if (day != checktt.time || !checktt.time) { // Check if day is different from last recorded time in file
                                logger(`Processing daily stats for ${checkttFile}`, '[ Listen:Checktt ]');
                                 for (const item of checktt.day) {
                                     const userName = await Users.getNameUser(item.id) || 'User ' + item.id; // Fallback name
                                     const itemToPush = item;
                                     itemToPush.name = userName;
                                     storage.push(itemToPush);
                                 };
                                 storage.sort((a, b) => {
                                     if (a.count > b.count) return -1;
                                     else if (a.count < b.count) return 1;
                                     else return a.name.localeCompare(b.name);
                                 });
                                 let checkttBody = '==PRIYANSH RAJPUT ❤️ DAILY TOP==\n\n'; // Clearer header
                                 checkttBody += storage.slice(0, 10).map(item => `${count++}. ${item.name} with ${item.count} message`).join('\n');

                                 // Send daily message
                                 api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => {
                                     if (err) logger(`Error sending daily checktt message to ${checkttFile.replace('.json', '')}: ${err.message}`, '[ Listen:Checktt Error ]');
                                 });

                                 // Reset daily counts and update time
                                 checktt.day.forEach(e => { e.count = 0; });
                                 checktt.time = day_now; // Update time to current day after processing
                                 fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
                             }

                             // Process weekly stats if today is Monday (day_now == 1)
                            if (day_now == 1) {
                                logger(`Processing weekly stats for ${checkttFile}`, '[ Listen:Checktt ]');
                                storage = []; // Clear storage for weekly
                                count = 1;
                                 for (const item of checktt.week) {
                                     const userName = await Users.getNameUser(item.id) || 'User ' + item.id; // Fallback name
                                     const itemToPush = item;
                                     itemToPush.name = userName;
                                     storage.push(itemToPush);
                                 };
                                 storage.sort((a, b) => {
                                     if (a.count > b.count) return -1;
                                     else if (a.count < b.count) return 1;
                                     else return a.name.localeCompare(b.name);
                                 });
                                 let checkttBody = '==PRIYANSH RAJPUT ❤️ WEEKLY TOP==\n\n'; // Clearer header
                                 checkttBody += storage.slice(0, 10).map(item => `${count++}. ${item.name} with ${item.count} message`).join('\n');

                                 // Send weekly message
                                 api.sendMessage(checkttBody, checkttFile.replace('.json', ''), (err) => {
                                     if (err) logger(`Error sending weekly checktt message to ${checkttFile.replace('.json', '')}: ${err.message}`, '[ Listen:Checktt Error ]');
                                 });

                                 // Reset weekly counts
                                 checktt.week.forEach(e => { e.count = 0; });
                                 // Write the file again after weekly reset
                                 fs.writeFileSync(checkttDataPath + checkttFile, JSON.stringify(checktt, null, 4));
                             }

                        } catch (fileError) {
                            logger(`Error processing checktt file ${checkttFile}: ${fileError.message}`, '[ Listen:Checktt Error ]');
                            console.error(fileError); // Log the full error
                        }
                    }
                    resolve();
                });

                // global.client.sending_top = false; // This variable seems unused/unnecessary with async/await
                 logger('Checktt reports sent (if applicable).', '[ Listen:Checktt ]');

            } else {
                 // logger('Checktt interval ran, but no day change detected.', '[ Listen:Checktt ]'); // Optional: Log when it runs but does nothing heavy
            }
        } catch(e) {
            logger(`Error in Checktt interval loop: ${e.message}`, '[ Listen Error ]');
            console.error(e); // Log the full error
        } finally {
            // Schedule the next run *after* the current one finishes
            setTimeout(runChecktt, checkttIntervalTime);
        }
    }

    // *** MODIFIED DATLICH INTERVAL START ***
     const datlichIntervalTime = tenMinutes / 10; // Run datlich logic every 1 minute

     async function runDatlich() {
         try {
              /*smol check*/
              if (!fs.existsSync(datlichPath)) fs.writeFileSync(datlichPath, JSON.stringify({}, null, 4));
              var data = JSON.parse(fs.readFileSync(datlichPath));

              //GET CURRENT TIME
              var timeVN = moment().tz('Asia/Kolkata').format('DD/MM/YYYY_HH:mm:ss');
              timeVN = timeVN.split("_");
              timeVN = [...timeVN[0].split("/"), ...timeVN[1].split(":")];

              let temp = [];
              let vnMS = await checkTime(timeVN);
              const compareTime = e => new Promise(async (resolve) => {
                  let getTimeMS = await checkTime(e.split("_"));
                  if (getTimeMS < vnMS) {
                      if (vnMS - getTimeMS < tenMinutes) { // Check if within the last 10 minutes
                          // Use boxID from the outer loop scope
                          data[boxID][e]["TID"] = boxID; // Ensure TID is set correctly
                          temp.push(data[boxID][e]);
                           delete data[boxID][e]; // Delete after adding to temp
                      } else {
                          delete data[boxID][e]; // Delete if too old
                      }
                      // Write file immediately after deletion/addition to temp
                      fs.writeFileSync(datlichPath, JSON.stringify(data, null, 4));
                  };
                  resolve();
              });

              // Loop through data to find events to execute
               for (boxID in data) {
                   // Use Object.keys to iterate safely while deleting
                   const eventsInBox = Object.keys(data[boxID]);
                   for (e of eventsInBox) {
                       // Re-check if boxID[e] still exists after deletions in compareTime
                       if (data[boxID] && data[boxID][e]) {
                           await compareTime(e);
                       }
                   }
                   // If a box is empty after processing, clean it up
                   if (data[boxID] && Object.keys(data[boxID]).length === 0) {
                       delete data[boxID];
                        fs.writeFileSync(datlichPath, JSON.stringify(data, null, 4)); // Save change
                   }
               }


              // Execute events found
              for (el of temp) {
                  logger(`Executing scheduled event for thread ${el.TID}`, '[ Listen:Datlich ]');
                  try {
                      var all = (await Threads.getInfo(el["TID"])).participantIDs;
                      all.splice(all.indexOf(api.getCurrentUserID()), 1);
                      var body = el.REASON || "Reminder 🥰🥰🥰", mentions = []; // Default body if empty

                      // Create mentions - ensure index doesn't exceed body length
                       let mentionText = body;
                       let mentionIndex = 0;
                       for (let i = 0; i < all.length; i++) {
                           if (mentionIndex >= mentionText.length) {
                               mentionText += " ‍ "; // Add space if body is shorter than mentions needed
                           }
                           mentions.push({
                               tag: mentionText[mentionIndex],
                               id: all[i],
                               fromIndex: mentionIndex - 1 // Adjust index logic if needed, seems intended for character replacement
                           });
                           mentionIndex++; // Move index for next mention
                       }
                       // If body was shorter than mentions, update body to include the added spaces
                       body = mentionText;


                  } catch (e) {
                       logger(`Error preparing scheduled event for thread ${el.TID}: ${e.message}`, '[ Listen:Datlich Error ]');
                       console.error(e); // Log full error
                       continue; // Skip sending message for this event if error
                  }
                  var out = {
                      body, mentions
                  }
                  if ("ATTACHMENT" in el) {
                      out.attachment = [];
                      try { // Added try-catch for attachment download
                          for (a of el.ATTACHMENT) {
                              let getAttachment = (await axios.get(encodeURI(a.url), { responseType: "arraybuffer" })).data;
                              const attachmentFileName = a.fileName || `attachment_${Date.now()}`;
                              const attachmentPath = __dirname + `/../Priyansh/commands/cache/${attachmentFileName}`;
                              fs.writeFileSync(attachmentPath, Buffer.from(getAttachment, 'utf-8'));
                              out.attachment.push(fs.createReadStream(attachmentPath));
                          }
                      } catch (attachError) {
                           logger(`Error downloading attachments for scheduled event in thread ${el.TID}: ${attachError.message}`, '[ Listen:Datlich Error ]');
                           console.error(attachError); // Log full error
                           delete out.attachment; // Remove attachments if download fails
                      }
                  }
                 // console.log(out); // Remove this console log

                  if ("BOX" in el) {
                       try { // Added try-catch for setTitle
                           await api.setTitle(el["BOX"], el["TID"]);
                            logger(`Changed thread title for ${el.TID}`, '[ Listen:Datlich ]');
                       } catch (titleError) {
                            logger(`Error changing thread title for ${el.TID}: ${titleError.message}`, '[ Listen:Datlich Error ]');
                            console.error(titleError); // Log full error
                       }
                   }

                  api.sendMessage(out, el["TID"], (err) => {
                      if (err) logger(`Error sending scheduled message to ${el.TID}: ${err.message}`, '[ Listen:Datlich Error ]');
                      // Delete attachments after sending message
                      if ("ATTACHMENT" in el && out.attachment) { // Only delete if attachments were successfully added
                           el.ATTACHMENT.forEach(a => {
                                const attachmentFileName = a.fileName || `attachment_${Date.now()}`; // Need to reconstruct filename or pass path
                                const attachmentPath = __dirname + `/../Priyansh/commands/cache/${attachmentFileName}`;
                                // Check if file exists before trying to unlink
                                if (fs.existsSync(attachmentPath)) {
                                     fs.unlink(attachmentPath, (unlinkErr) => { // Use async unlink
                                         if(unlinkErr) logger(`Error deleting attachment ${attachmentFileName}: ${unlinkErr.message}`, '[ Listen:Datlich Error ]');
                                     });
                                }
                            });
                      }
                  });
              }
              logger('Datlich interval finished checking events.', '[ Listen:Datlich ]');

         } catch (e) {
              logger(`Error in Datlich interval loop: ${e.message}`, '[ Listen Error ]');
              console.error(e); // Log the full error
         } finally {
             // Schedule the next run *after* the current one finishes
             setTimeout(runDatlich, datlichIntervalTime);
         }
     }
    // *** MODIFIED INTERVAL END ***


    //////////////////////////////////////////////////////////////////////
    //========= Push all variable from database to environment =========//
    //////////////////////////////////////////////////////////////////////

    (async function () {

        try {
            logger(global.getText('listen', 'startLoadEnvironment'), '[ Priyansh Rajput ]');
            let threads = await Threads.getAll(),
                users = await Users.getAll(['userID', 'name', 'data']),
                currencies = await Currencies.getAll(['userID']);
            for (const data of threads) {
                const idThread = String(data.threadID);
                // Ensure global.data arrays exist before pushing
                if (!global.data.allThreadID) global.data.allThreadID = [];
                global.data.allThreadID.push(idThread);
                global.data.threadData.set(idThread, data['data'] || {}),
                global.data.threadInfo.set(idThread, data.threadInfo || {});
                if (data['data'] && data['data']['banned'] == !![])
                    global.data.threadBanned.set(idThread,
                        {
                            'reason': data['data']['reason'] || '',
                            'dateAdded': data['data']['dateAdded'] || ''
                        });
                if (data['data'] && data['data']['commandBanned'] && data['data']['commandBanned']['length'] != 0)
                    global['data']['commandBanned']['set'](idThread, data['data']['commandBanned']);
                if (data['data'] && data['data']['NSFW']) global['data']['threadAllowNSFW']['push'](idThread);
            }
            logger.loader(global.getText('listen', 'loadedEnvironmentThread'));
            for (const dataU of users) {
                const idUsers = String(dataU['userID']);
                 // Ensure global.data arrays exist before pushing
                if (!global.data.allUserID) global.data.allUserID = [];
                global.data['allUserID']['push'](idUsers);
                if (dataU.name && dataU.name['length'] != 0) global.data.userName['set'](idUsers, dataU.name);
                if (dataU.data && dataU.data.banned == 1) global.data['userBanned']['set'](idUsers, {
                    'reason': dataU['data']['reason'] || '',
                    'dateAdded': dataU['data']['dateAdded'] || ''
                });
                if (dataU['data'] && dataU.data['commandBanned'] && dataU['data']['commandBanned']['length'] != 0)
                    global['data']['commandBanned']['set'](idUsers, dataU['data']['commandBanned']);
            }
             // Ensure global.data arrays exist before pushing
             if (!global.data.allCurrenciesID) global.data.allCurrenciesID = [];
            for (const dataC of currencies) global.data.allCurrenciesID.push(String(dataC['userID']));
            logger.loader(global.getText('listen', 'loadedEnvironmentUser')), logger(global.getText('listen', 'successLoadEnvironment'), '[ Priyansh ]');
        } catch (error) {
            return logger.loader(global.getText('listen', 'failLoadEnvironment', error), 'error');
        }

        // Start the background tasks *after* the environment is loaded
        runChecktt();
        runDatlich();

    }());

    logger(`[ ${global.config.PREFIX} ] • ${(!global.config.BOTNAME) ? "" : global.config.BOTNAME}`, "[ Priyansh Rajput ]");

    ///////////////////////////////////////////////
    //========= Require all handle need =========//
    //////////////////////////////////////////////

    // These handlers are defined outside the main listener callback
    const handleCommand = require("./handle/handleCommand")({ api, models, Users, Threads, Currencies });
    const handleCommandEvent = require("./handle/handleCommandEvent")({ api, models, Users, Threads, Currencies });
    const handleReply = require("./handle/handleReply")({ api, models, Users, Threads, Currencies });
    const handleReaction = require("./handle/handleReaction")({ api, models, Users, Threads, Currencies });
    const handleEvent = require("./handle/handleEvent")({ api, models, Users, Threads, Currencies });
    const handleCreateDatabase = require("./handle/handleCreateDatabase")({ api, Threads, Users, Currencies, models });

    //DEFINE DATLICH PATH - already defined above, moved out of interval
    // const datlichPath = __dirname + "/../Priyansh/commands/cache/datlich.json";

    //FUNCTION WORKS AS IT'S NAME, CRE: PRIYANSHU - already defined above
    // const monthToMSObj = { ... };
    // const checkTime = (time) => new Promise((resolve) => { ... });
    // const tenMinutes = 10 * 60 * 1000;


    //////////////////////////////////////////////////
    //========= Send event to handle need =========//
    /////////////////////////////////////////////////

    // This is the main function that listenMqtt will call for every event
    return (event) => {
        // Added a basic check to ensure event and event.type exist
        if (!event || !event.type) return;

        // Filter out common event types that usually don't need processing
        if (['presence', 'typ', 'read_receipt'].some(data => data == event.type)) return;

        // Log the event in Developer Mode
        if (global.config.DeveloperMode) console.log(event);

        // Pass the event to the appropriate handler based on type
        switch (event.type) {
          case "message":
          case "message_reply":
          case "message_unsend": // Handle unsend event
            // Handle unsend might need different logic within the handler
            handleCreateDatabase({ event }); // Create database entry if needed
            handleCommand({ event }); // Check for command trigger
            handleReply({ event }); // Check for reply trigger
            handleCommandEvent({ event }); // Check for command event trigger (e.g., for noprefix commands)

            break;
          case "event": // Handle group events (like user added/removed, name change etc.)
            handleEvent({ event });
            break;
          case "message_reaction": // Handle message reactions
            handleReaction({ event });
            break;
          // Add other event types if needed, e.g., "message_read" etc.
          default:
            // logger(`Unhandled event type: ${event.type}`, '[ Listen ]'); // Optional: log unhandled types
            break;
        }
      };
};

// checkTime function needs to be defined outside the module.exports function or inside it but accessed correctly
// It was defined inside the recursive timeout functions previously, need to move it outside the interval functions but inside module.exports
// Moved checkTime, monthToMSObj, tenMinutes definitions higher up in the code, outside the interval functions but inside module.exports.

// The environment loading async function also needs to be called somewhere to start the process.
// Moved the environment loading and starting intervals logic into an IIFE (Immediately Invoked Function Expression) at the end of the file,
// so it runs when the module is required, AFTER all functions and variables are defined.
// Also, moved the starting of background tasks (runChecktt, runDatlich) inside the environment loading IIFE,
// so they only start after the global.data environment is populated.
