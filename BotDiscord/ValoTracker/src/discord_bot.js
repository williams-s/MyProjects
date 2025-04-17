const {keys} = require('../config/config.js');
const { Client, GatewayIntentBits, REST, Routes } = require("discord.js");
const {getPlayers} = require('./players/getPlayers.js');
const {getDiscordId} = require('./discord/getDiscordId.js');
const schedule = require('node-schedule');
const HenrikDevValorantAPI = require("unofficial-valorant-api");
const {setLang} = require('./languages/translate.js');
const {refreshData} = require('./ranks/refreshData.js');
const {rankReset} = require("./ranks/rankReset");
const fs = require('fs');
const path = require('path');

let listPlayersByChannel = {};
let allDiscords = {};
let myLanguageWords = {};
let allGuilds = {};

const VAPI = new HenrikDevValorantAPI(
  keys.apiKey
);

const vctLogo = fs.readFileSync(path.join(__dirname, '../assets/vctlogo.png'));
const {commands} = require("./commands/allCommands");
const {initCommands} = require("./commands/commandsInteractions");

// Configuration du bot
const config = {
  clientId: keys.clientId,
  token: keys.tokken,
  guildId: keys.guildId,
  channelName: keys.channelName,
  channelID: keys.channelId,
};


const hourReset = "0 8 * * *";
const getPlayersReset = "10 7 * * *";
let playersList = [];
let guild = null;
let channel = null; 
getPlayers(playersList, listPlayersByChannel);
getDiscordId(allDiscords,allGuilds);



setLang(null,myLanguageWords);

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("Started refreshing global application (/) commands.");
    await rest.put(Routes.applicationCommands(config.clientId), {
      body: commands,
    });
    console.log("Successfully reloaded global application (/) commands.");
  } catch (error) {
    console.error(error);
  }
})();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});



client.once("ready", () => {
  console.log(`Bot ${client.user.tag} is online.`);
  guild = client.guilds.cache.get(config.guildId); 
  channel = client.channels.cache.get(config.channelID);
  //channel = guild.channels.cache.find(c => c.name === config.channelName);
});



initCommands(client,myLanguageWords,allGuilds,allDiscords,listPlayersByChannel,VAPI,playersList);

schedule.scheduleJob(hourReset, () => {
  rankReset(allDiscords, listPlayersByChannel, VAPI, myLanguageWords, client, vctLogo);
});

schedule.scheduleJob(getPlayersReset, () => {
  getPlayers(playersList, listPlayersByChannel);
});

setInterval(() => {
  refreshData(allDiscords, listPlayersByChannel, VAPI, myLanguageWords,client);
}, 120000);


client.login(
    config.token
);
  
  
