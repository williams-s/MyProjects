const commands = [
    {
        name : "allcommands",
        description: "List of commands",
        options: [],
    },
    {
        name: "help",
        description: "Get help",
        options: [],
    },
    {
        name: "init",
        description: "Initialize the channel for the bot",
        options: [],
    },
    {
        name: "en",
        description: "Change the language of the bot to English",
        options: [],
    },
    {
        name: "fr",
        description: "Change the language of the bot to French",
        options: [],
    },
    {
        name: "es",
        description: "Change the language of the bot to Spanish",
        options: [],
    },
    {
        name: "de",
        description: "Change the language of the bot to German",
        options: [],
    },

    {
        name: "add-player",
        description: "Add player to the tracklist of the server respecting the exact syntax of the name and no #",
        options: [
            {
                type: 3, // 'STRING' type
                name: "name",
                description: "Riot Name of the user",
                required: true,
            },
            {
                type: 3, // 'STRING' type
                name: "tag",
                description: "Riot Tag of the user",
                required: true,
            },
        ],
    },
    {
        name: "remove-player",
        description: "Remove player from the tracklist of the server respecting the exact syntax of the name and no #",
        options: [
            {
                type: 3, // 'STRING' type
                name: "name",
                description: "Riot Name of the user",
                required: true,
            },
            {
                type: 3, // 'STRING' type
                name: "tag",
                description: "Riot Tag of the user",
                required: true,
            },
        ],
    },
    {
        name: "leaderboard",
        description: "Show the leaderboard of the server",
    },
    {
        name: "profile",
        description: "Show the profile of the user",
        options: [
            {
                type: 3, // 'STRING' type
                name: "name",
                description: "Riot Name of the user",
                required: true,
            },
            {
                type: 3, // 'STRING' type
                name: "tag",
                description: "Riot Tag of the user",
                required: true,
            },
        ],
    },
];

module.exports = {
    commands
};