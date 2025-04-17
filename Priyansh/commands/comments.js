const axios = require("axios");
const fs = require("fs");
const moment = require("moment-timezone");

module.exports.config = {
  name: "autoComment",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Developed by Rudra",
  description: "Automatically comment on posts",
  commandCategory: "No Prefix",
  usages: "",
  cooldowns: 0,
};

module.exports.handleEvent = async function ({ api, event, args, Users, Threads }) {
  const { senderID, threadID, messageID } = event;
  const uid = "61550558518720"; // Your UID
  const commentList = [
    "Osm pic",
    "Jabardast",
    "Bindaas",
    "Jhakkas"
  ];

  try {
    // Get all the posts of the user with UID (you can replace this with an API call or pre-saved post list)
    const userPosts = await api.getUserPosts(uid);
    const post = userPosts[0]; // Get latest post

    // Select a random comment
    const comment = commentList[Math.floor(Math.random() * commentList.length)];

    // Send comment on the selected post
    await api.sendMessage({ body: comment }, post.threadID, post.messageID);

    // Log comment
    console.log(`Commented on post: "${comment}"`);

    // Add a delay for 1 hour before commenting again
    setTimeout(async () => {
      await module.exports.handleEvent({ api, event, args, Users, Threads });
    }, 3600000); // 1 hour = 3600000 ms
  } catch (error) {
    console.error("Error in commenting:", error);
  }
};

module.exports.run = function ({ api, event, client, __GLOBAL }) {};
