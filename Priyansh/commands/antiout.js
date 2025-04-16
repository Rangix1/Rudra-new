module.exports.config = {
    name: "antiout",
    version: "1.0.0",
    hasPermssion: 2, // Permission level required
    credits: "Priyansh Rajput",
    description: "Sends emotional innocent message and media when someone leaves and is added back to the group.",
    commandCategory: "group",
    usages: "antiout",
    cooldowns: 10
};

module.exports.run = async function({ api, event, threadID }) {
    const { senderID, body } = event;

    // Check if the user left the group and is being added back
    if (body && body.toLowerCase() === "left") {
        // Set links for anime video or photo
        const mediaLinks = [
            "https://www.example.com/innocent-anime-photo.jpg", // Replace with an innocent anime photo link
            "https://www.example.com/innocent-anime-video.mp4", // Replace with an innocent anime video link
            "https://www.example.com/innocent-song-video.mp4" // Replace with a link to an innocent song video
        ];

        // Choose a random media link
        const randomMedia = mediaLinks[Math.floor(Math.random() * mediaLinks.length)];

        // Send an emotional message and media when the user is added back
        api.sendMessage({
            body: `Chhode the tumne humhe, humare dil ko todke... Par wapas aaye ho tum, dil ko sukoon mila hai. 😊`,
            attachment: randomMedia
        }, threadID);
    }
};
