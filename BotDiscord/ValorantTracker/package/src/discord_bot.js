const {rankIndex} = require('./ranksValo.js');
const { Client, GatewayIntentBits, REST, Routes,EmbedBuilder } = require("discord.js");
const schedule = require('node-schedule');
const HenrikDevValorantAPI = require("unofficial-valorant-api");
const fs = require('fs');
const yaml = require('js-yaml');
const initialize = require('./languages.js');
const {sendEmbed,wrongChannelMsg} = require('./sendEmbed.js');
const { log } = require('console');
let configInit = null;
let configUrl = null;
let emojisRank = null;
let listPlayersByChannel = {};
let allDiscords = {};
let myLanguageWords = {};
let allGuilds = {};
try {
  let config2 = yaml.load(fs.readFileSync('../config/config.yaml', 'utf8'));
  configInit = config2.keys;
  configUrl = config2.urls;
  emojisRank = config2.emojisRank;
} catch (error) {
  console.error(error);
}

const VAPI = new HenrikDevValorantAPI(
  configInit.apiKey
);
const url = configUrl.api;
const discordInfosUrl = configUrl.discordInfos;
const vctLogo = configUrl.vctlogo;

// Configuration du bot
const config = {
  clientId: configInit.clientId,
  token: configInit.tokken,
  guildId: configInit.guildId,
  channelName: configInit.channelName,
  channelID: configInit.channelId,
};


const hourReset = "0 8 * * *";
const getPlayersReset = "10 7 * * *";
let playersList = [];
let guild = null;
let channel = null; 
getPlayers();
getDiscordId();

//lang.langUrl = configUrl.language;

/* async function setLang(lang) {
  try {
      initialize(lang).then((exports) => {
          myLanguageWords = exports;
          console.log(myLanguageWords.dailySummarySubtitleYaml);
      });
  } catch (error) {
      console.error("Failed to initialize and use language data:", error);
  }
} */

async function wrongChannel(guild_id) {
  let good_channel = await client.channels.fetch(allGuilds[guild_id].channel_id);
  await setLang(allGuilds[guild_id].lang); 
  return (wrongChannelMsg(myLanguageWords.errorTitle,`${myLanguageWords.wrongChannel} \n ${myLanguageWords.goodChannel} : ${good_channel}`));
}
async function setLang(lang) {
  try {
      // Assurez-vous que `initialize` retourne une promesse
      myLanguageWords = await initialize(lang);
      //console.log(myLanguageWords);
  } catch (error) {
      console.error("Failed to initialize and use language data:", error);
  }
}
setLang("French");

//lang.setLang("French");
//console.log(setLang.initTitle)
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

// Enregistrer les commandes globales
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

// Initialiser le bot
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

async function getAccount(name,tag) {
  let data = await VAPI.getAccount({
      name: name,
      tag: tag
  });
  data = data.data;
  //console.log(data);
  let data2 = await VAPI.getMMRByPUUID({
      version: "v1",
      region: "eu",
      puuid: data.puuid,
  });
  data2 = data2.data;
  card = data.card;
  let rank = data2.currenttierpatched;
  const tab = {
      name : data.name,
      tag : data.tag,
      level : data.account_level,
      rank : rank,
      cardIcon : card.large,
      cardSmall : card.small,
      lp : data2.ranking_in_tier + " rr",
      mmr_gain : data2.mmr_change_to_last_game,
      rankIcon : matchRankWithEmote(rank),
  }
  if (tab.mmr_gain >= 0) {
    tab.mmr_gain = "+" + tab.mmr_gain;
  }
  else {
    tab.mmr_gain = tab.mmr_gain.toString();
  }
  const embed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle(tab.name + "#" + tab.tag)
  .setURL(`https://tracker.gg/valorant/profile/riot/${tab.name}%23${tab.tag}/overview`)
  .addFields(
    { name: 'Level', value: tab.level.toString(), inline: true },
    { name: 'Rank', value: tab.rankIcon + " " + tab.rank + " " + tab.lp, inline: true },
    { name: myLanguageWords.lastGame, value: tab.mmr_gain, inline: false },
  )
  .setThumbnail(tab.cardSmall);

  return embed
}

async function updateLang(lang,guildID,channelID) {
  fetch(discordInfosUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      lang: lang,
      guild_id: guildID
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    allDiscords[channelID].lang = lang;
    allGuilds[guildID].lang = lang;
  })
  .catch(error => {
    console.error(error);
  });
}


client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;
  
  let channel_id = interaction.channel.id;
  let guild_id = interaction.channel.guildId;

  if(interaction.commandName === "help") {
    await interaction.deferReply({ ephemeral: false });
    if (!allGuilds[guild_id]) {
      await setLang("en");
    }
    else {
      await setLang(allGuilds[guild_id].lang);
    }
    let embed =  sendEmbed(0x0099ff, myLanguageWords.helpTitle, myLanguageWords.helpDescription, null, true);
    interaction.editReply({embeds : [embed]});
  }

  if (interaction.commandName === "allcommands"){
    await interaction.deferReply({ ephemeral: false });
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
    await setLang(allDiscords[channel_id].lang);
    let embed =  sendEmbed(0x0099ff, myLanguageWords.allcommandsTitle, myLanguageWords.allcommandsDescription, null, true);
    interaction.editReply({embeds : [embed]});
  }
  if (interaction.commandName === "add-player") {
    await interaction.deferReply({ ephemeral: false });
    let channel_id = interaction.channel.id;
    let guild_id = interaction.channel.guildId;
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
    await setLang(allDiscords[channel_id].lang);
    try {
      const nameValue = interaction.options.getString('name');
      const tagValue = interaction.options.getString('tag');
      const added = await insertPlayer(nameValue, tagValue, guild_id, channel_id);
      //console.log("dzaopazk " + added);
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(myLanguageWords.addPlayerTitle)
        .setDescription(`${nameValue}#${tagValue} ${myLanguageWords.addPlayerDescription}`)
        .setTimestamp();
      if (added == true) {
        interaction.followUp({ embeds: [embed] });
      }
      else {
        embed.setTitle('Erreur')
        embed.setDescription(`${nameValue}#${tagValue} ${myLanguageWords.addPlayerError}`)
        interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }

  if (interaction.commandName === "remove-player") {
    await interaction.deferReply({ ephemeral: false });
    let channel_id = interaction.channel.id;
    let guild_id = interaction.channel.guildId;
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
    await setLang(allDiscords[channel_id].lang);
    try {
      const nameValue = interaction.options.getString('name');
      const tagValue = interaction.options.getString('tag');
      const deleted = await deletePlayer(nameValue, tagValue,channel_id);
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(myLanguageWords.removePlayerTitle)
        .setDescription(`${nameValue}#${tagValue} ${myLanguageWords.removePlayerDescription}`)
        .setTimestamp();
      //console.log("dzaopazk " + deleted);
      if (deleted == true) {
        interaction.followUp({ embeds: [embed] });
        listPlayersByChannel[channel_id] = listPlayersByChannel[channel_id].filter(player => player.name !== nameValue && player.tag !== tagValue && player.channel_id !== channel_id);
      }
      else {
        embed.setDescription(`${nameValue}#${tagValue} ${myLanguageWords.removePlayerError}`)
        interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }

  if (interaction.commandName === "leaderboard") {
    await interaction.deferReply({ ephemeral: false });
    let guild_id = interaction.channel.guildId;
    let channel_id = interaction.channel.id;
    if(allDiscords[channel_id]) {
      await setLang(allDiscords[channel_id].lang);
    try {
      await sortList(); 
      const leaderboard = listPlayersByChannel[interaction.channel.id];
      //console.log(leaderboard);
      let description = "";
      if (leaderboard === undefined) {
        let embed = sendEmbed(0x0099ff, myLanguageWords.leaderboardTitle, myLanguageWords.leaderboardError, null, true);
        interaction.editReply({embeds : [embed]});
        return;
      }
      for(let i = 0; i < leaderboard.length; i++) {
        let player = leaderboard[i];
        description += `${i+1}. ${player.name}#${player.tag} - ${player.tier} ${player.rr}rr\n`;
      }
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(myLanguageWords.leaderboardTitle)
        .setDescription(description)
        .setTimestamp();
      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
    }else{
      //let good_channel = await client.channels.fetch(allGuilds[guild_id].channel_id); 
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
    }
  }
  if (interaction.commandName === "init") {
    await interaction.deferReply({ ephemeral: false });
    let guild_id = interaction.channel.guildId;
    let channel_id = interaction.channel.id;
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTimestamp();
    if(allGuilds[guild_id]){
      let past_channel_id = allGuilds[guild_id].channel_id;
      let updateValue = await updateDiscordId(guild_id,channel_id);
      //console.log(updateValue);
      if (updateValue === true){ 
        if(past_channel_id != channel_id){
          listPlayersByChannel[channel_id] = listPlayersByChannel[past_channel_id];
          for (let i = 0; i < listPlayersByChannel[channel_id].length; i++) {
            listPlayersByChannel[channel_id][i].channel_id = channel_id;
          }
          delete listPlayersByChannel[past_channel_id]; 
          delete allDiscords[past_channel_id];
          await setLang(allGuilds[guild_id].lang);
          embed.setTitle(myLanguageWords.initTitle)
          embed.setDescription(myLanguageWords.initDescription);
          interaction.followUp({ embeds: [embed] });
        } else {
          await setLang(allGuilds[guild_id].lang);
          embed.setTitle(myLanguageWords.initTitle)
          embed.setDescription(myLanguageWords.initSameChannel)
          interaction.followUp({ embeds: [embed] });
          return;
        }
      } else {
        console.error("error");
      }
    }else{
      await setLang("en");
      let addDiscordBool = await addDiscordId(guild_id,channel_id);
      //console.log(addDiscordBool," addDiscordBool ",addDiscordBool);
      if (addDiscordBool == true){
        try {
          const embed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle(myLanguageWords.initTitle)
            .setDescription(myLanguageWords.initDescription)
            .setTimestamp();
          interaction.followUp({ embeds: [embed] });
        } catch (error) {
          interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
        }
      }else{
/*         const embed = new EmbedBuilder()
          .setColor(0x0099ff)
          .setTitle(myLanguageWords.initTitle)
          .setDescription(`${myLanguageWords.initError} hint : use /unbind to setup a new channel`)
          .setTimestamp();
        interaction.followUp({ embeds: [embed] }); */
      }
    }
  }
  if (interaction.commandName === "en") {
    await interaction.deferReply({ ephemeral: false });

    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
    if (updateLang("en",interaction.channel.guildId,interaction.channel.id)){
    await setLang("en");
    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle("Language changed to English")
      .setDescription("The language has been changed to English")
      .setTimestamp();
    interaction.followUp({ embeds: [embed] });
    }else{
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }
  if (interaction.commandName === "fr") {
    await interaction.deferReply({ ephemeral: false });
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
      if (updateLang("French",interaction.channel.guildId,interaction.channel.id)){
        await setLang("French");
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("La langue a été changée en Français")
        .setDescription("La langue a été changée en Français")
        .setTimestamp();
      interaction.followUp({ embeds: [embed] });
    }else{
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  } 
  if (interaction.commandName === "es") {
    await interaction.deferReply({ ephemeral: false });
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
      if (updateLang("es",interaction.channel.guildId,interaction.channel.id)){
        await setLang("es");
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Idioma cambiado a Español")
        .setDescription("El idioma ha cambiado a Español")
        .setTimestamp();
      interaction.followUp({ embeds: [embed] });
    }else{
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }
  if (interaction.commandName === "de") {
    await interaction.deferReply({ ephemeral: false });
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]});
      return;
    }
      if (updateLang("de",interaction.channel.guildId,interaction.channel.id)){
        await setLang("de");
        const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle("Sprache geändert auf Deutsch")
        .setDescription("Die Sprache wurde auf Deutsch geändert")
        .setTimestamp();
      interaction.followUp({ embeds: [embed] });
    }else{
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }

  if (interaction.commandName === "profile") {
    await interaction.deferReply({ ephemeral: false });
    let channel_id = interaction.channel.id;
    let guild_id = interaction.channel.guildId;
    if (!allDiscords[channel_id]) {
      let embed = await wrongChannel(guild_id);
      interaction.editReply({embeds : [embed]}); 
      return;
    }
    await setLang(allDiscords[channel_id].lang);
    let name = interaction.options.getString("name");
    let tag = interaction.options.getString("tag");
    let embed = await getAccount(name,tag);
    interaction.followUp({ embeds: [embed] });
  }

});

async function refreshData() {
    for (let channel_id in listPlayersByChannel) {
      await setLang(allDiscords[channel_id].lang);
      let players = listPlayersByChannel[channel_id];
      for (let i = 0; i < players.length; i++) {
        let player = players[i];
        //console.log(player.name + " " + player.tag);
        try {
            const mmr_data = await VAPI.getMMRHistory({
                region: "eu",
                name:player.name,
                tag: player.tag,
            });
            if (mmr_data.error) {
                console.error(mmr_data.error);
            }
            const dataString = JSON.parse(JSON.stringify(mmr_data.data));
            const lastGame = dataString[0];
            const matchId = lastGame.match_id;
            //console.log("last game id : " + matchId);
            const rank = lastGame.currenttierpatched;
            const lp = lastGame.ranking_in_tier;
            const lpGain = lastGame.mmr_change_to_last_game;
            const map = lastGame.map.name;
            //console.log(lastGame);
            let verbForResult = "gagner";
            if (lpGain > 0) {
              verbForResult = myLanguageWords.positiveYaml;
            }
            else if (lpGain < 0) {
              verbForResult = myLanguageWords.negativeYaml;
            }
            else {
              verbForResult = myLanguageWords.neutralYaml;
            }
            if (player.lastMatchId !== matchId) {
              //console.log("Last match id : " + player.lastMatchId + " - " + matchId);
              if (updateMatchId(player,matchId)){
                //console.log("Match id updated");
                player.lastMatchId = matchId;
              }
              try {
                const match = await VAPI.getMatches({region: "eu", name: player.name, tag: player.tag});
                let result = getResult(match.data[0],player);
                let resultGame = result.resultGame;
                let score = result.score;
                let agent = result.agent;
                let agentIcon = result.agentIcon;
                let kda = result.kda;
                let combatScore = result.combatScore;
                
                //console.log("dkzodkzo " + combatScore);
                let hsRate = result.hsRate;
                let colorEmbed = result.colorEmbed;
                let card = result.card;
                player.rr = lp;
                player.tier = rank;
                //console.log(match.data[0].metadata.matchid + " ===== " + matchId);
                //console.log(match.data[0].metadata);
                if (match.data[0].metadata.matchid === matchId) {
                  //console.log("Match found");
                  updateRank(player, rank, lp);
                  let emote = matchRankWithEmote(rank);
                  const embed = new EmbedBuilder()
                  .setColor(colorEmbed)
                  .setTitle(`${resultGame}`) 
                  .setThumbnail(agentIcon)
                  .setDescription(`${player.name}#${player.tag} ${verbForResult} **${lpGain}rr** ! \n ${myLanguageWords.actualRankYaml}: ${emote}  **${rank}  ${lp}rr**`)
                  .setURL(`https://tracker.gg/valorant/match/${matchId}`)
                  .addFields(
                      { name: 'Score', value: `${score}`, inline: true },
                      { name: 'Map', value: `${map}`, inline: true },
                      { name: 'Agent', value: `**${agent}**`, inline: true },
                      { name: myLanguageWords.combatScoreYaml, value: `${combatScore}`, inline: true },
                      { name: 'Headshot %', value: `${hsRate}`, inline: true },
                      { name: 'KDA', value: `${kda}`, inline: true },
                  )
                  .setTimestamp();

              // Chercher le canal par nom
              const guild = client.guilds.cache.get(config.guildId); // On suppose que le bot est dans au moins une guilde
              let channel = client.channels.cache.get(player.channel_id);
              if (channel) {
                  channel.send({ embeds: [embed] });
              } else {
                  console.error('Channel not found');
              }
                }
              } catch (error) {
                console.error(error);
              }

            //console.log(lastGame);

          }
        } catch (error) {
            console.error(error);
        }
    }
  }
}

async function getPlayers() {
  playersList = [];
  listPlayersByChannel = {};
  //console.log("get players");
  fetch(url  , {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        data.forEach(user => {
          let playerInfo = {
            name: user.nom,
            tag: user.tag,
            lastMatchId: user.matchId,
            tier : user.tier,
            rr : user.rr,
            elo : user.elo,
            past_rank : user.past_rank,
	          past_rr : user.past_rr,
            win: user.win, 
            lose: user.lose,
            draw: user.draw,
            channel_id: user.channel_id,
            guild_id: user.guild_id
          }
          playersList.push(playerInfo);
        });
        playersList.forEach(player => {
          if (!listPlayersByChannel[player.channel_id]) {
            listPlayersByChannel[player.channel_id] = [];
          }
          listPlayersByChannel[player.channel_id].push(player);
        })
        //console.log(listPlayersByChannel);
        //console.log(playersList);
      }
    )
    .catch(error => console.error(error));

}

async function updateMatchId(player, newMatchId) {
  //console.log("kdjjzijdz : " + playersList[0]);

  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      matchId: newMatchId,
      nom: player.name,
      tag: player.tag,
      id_discord: allDiscords[player.channel_id].id
    })
  })
  .then(response => {
    // Lire la réponse comme texte brut
    return response.text().then(text => {
      // Vérifier si la réponse est un JSON valide
      try {
        const data = JSON.parse(text);
        //console.log(data);
        return data;
/*         for (let i = 0; i < playersList.length; i++) {
          if (playersList[i].name === player.name && playersList[i].tag === player.tag) {
            playersList[i].lastMatchId = newMatchId;
            break;
          }
        } */
      } catch (e) {
        //console.error("Erreur lors de la conversion de la réponse en JSON:", e);
        //console.log("Réponse brute:", text);
        return false;
      }
    });
  })
  .catch(error => console.error("Erreur lors de l'appel fetch:", error));

}

async function insertPlayer(nameValue,tagValue,guildID,channelID) {
  try {
    const mmr_data = await VAPI.getMMRHistory({
        region: "eu",
        name: nameValue,
        tag: tagValue,
    });
    if (mmr_data.error) {
        console.error(mmr_data.error);
    }
    const dataString = JSON.parse(JSON.stringify(mmr_data.data));
    const lastGame = dataString[0];
    const matchId = lastGame.match_id;
    const rank = lastGame.currenttierpatched;
    const lp = lastGame.ranking_in_tier;
    const elo = lastGame.elo;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        matchId: matchId,
        nom: nameValue,
        tag: tagValue,
        tier: rank,
        rr: lp,
        elo: elo,
        past_rank : rank,
        past_rr : lp,
        win: 0,
        lose: 0,
        draw: 0,
        id_discord: allDiscords[channelID].id
      })
    });
      try {
        const data = await response.json();
        //console.log(data);
        let playerInfo = {name: nameValue, tag: tagValue, lastMatchId: matchId, tier: rank, rr: lp, elo: elo, past_rank: rank, past_rr: lp, win: 0, lose: 0, draw: 0,guild_id: guildID,channel_id: channelID}
        playersList.push(playerInfo);
        if (!listPlayersByChannel[playerInfo.channel_id]) {
          listPlayersByChannel[playerInfo.channel_id] = [];
        }
        listPlayersByChannel[playerInfo.channel_id].push(playerInfo);
        //console.log(listPlayersByChannel[playerInfo.channel_id]);
        return data;
      } catch (e) {
        console.error("Erreur lors de la conversion de la réponse en JSON:", e);
        //console.log("Réponse brute:", text);
        return false;
      }
        ;

    
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deletePlayer(nameValue,tagValue,channelID) {
  let player = {
    name: nameValue,
    tag: tagValue,
    channel_id: channelID
  }
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: player.name,
      tag: player.tag,
      id_discord: allDiscords[player.channel_id].id
      
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    if (data > 0) {
      //console.log("Joueur supprimé");
      for (let i = 0; i < playersList.length; i++) {
        if (playersList[i].name === nameValue && playersList[i].tag === tagValue && playersList[i].channel_id === channelID) {
          playersList.splice(i, 1);
          break;
        }
      }
      //console.log(playersList);
      return true;
    } else {
      //console.log("Joueur non supprimé");
      return false;
    }
  })
  .catch(error => {
    console.error(error);
    return false;
  });
}


function capitalizeFirstLetter(str) {
  if (str.length === 0) return str; // Gérer les chaînes vides
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function sortList() {
  playersList.sort((a, b) => {
    const rankComparison = rankIndex(b.tier) - rankIndex(a.tier);
    if (rankComparison !== 0) {
      return rankComparison;
    }
    return b.rr - a.rr;
  })
}

async function updateRank(player, newRank, newLP) {
  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: player.name,
      tag: player.tag,
      tier: newRank,
      rr: newLP,
      id_discord: allDiscords[player.channel_id].id
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
}

async function updateElo(player,newElo,newRank, newRr) {
  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: player.name,
      tag: player.tag,
      elo: newElo,
      past_rank: newRank,
      past_rr: newRr,
      id_discord: allDiscords[player.channel_id].id
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
  })
  .catch(error => {
    console.error(error);
  });
}



async function rankReset(){
  //console.log("rankReset");
  let description = "";
  let elo = null;
  let lp = null;
  let rank = null;
  sortList();
  for (let channel_id in listPlayersByChannel) {
    description = "";
    await setLang(allDiscords[channel_id].lang);
    let players = listPlayersByChannel[channel_id];
    for (let i = 0; i < players.length; i++) {
      let player = players[i];
      const win = Number(player.win);
      const lose = Number(player.lose);
      const draw = Number(player.draw);
      if (lose === 0 && win === 0 && draw === 0) {
        
      }
      else {
        elo = player.elo;
        lp = player.rr;
        rank = player.tier;
        past_rank = player.past_rank;
        past_rr = player.past_rr;
        if (elo == null) {
          //console.log("Elo non renseigné");
        } else {
          try {
            const mmr_data = await VAPI.getMMRHistory({
                region: "eu",
                name: player.name,
                tag: player.tag,
            });
            if (mmr_data.error) {
                console.error(mmr_data.error);
            }
            const dataString = JSON.parse(JSON.stringify(mmr_data.data));
            const lastGame = dataString[0];
            const rankNew = lastGame.currenttierpatched;
            const lpNew = lastGame.ranking_in_tier;
            const eloNew = lastGame.elo;
            const diff = eloNew - elo;

            let record = "";
            if (win !== 0) {
              record += `${win} win(s) `;
            }
            if (lose !== 0) {
              record += `${lose} loss(es) `;
            }
            if (draw !== 0) {
              record += `${draw} draw(s)`;
            }
            const allgames = win + lose + draw;
            const winrate = (win / allgames) * 100;
            let sign = "+";
            if (diff < 0) {
              sign = "-";
            }
            description += `**${capitalizeFirstLetter(player.name)}#${player.tag} : ${sign}${Math.abs(diff)}** 
            ${past_rank} ${past_rr}rr -> ${rankNew} ${lpNew}rr 
            (${allgames} game(s) : ${record} | ${winrate.toFixed(2)}% winrate) \n \n`;
            updateElo(player,eloNew,rank,lp);
          } catch (error) {
            console.error(error);
          }
        }
      }
      resetRecord(player);
    }
    let channel = client.channels.cache.get(channel_id);
    const embed = new EmbedBuilder()
      .setColor(0xA020F0)
      .setThumbnail(vctLogo)
      .setTitle('Daily Summary')
      .setDescription(`${myLanguageWords.dailySummarySubtitleYaml} : \n\n ${description}`)
      .setTimestamp();
    //console.log(description);
    if (description !== "") {
      channel.send({ embeds: [embed] });
    }else{
      //console.log(description);
    }
  }
}

const job = schedule.scheduleJob(hourReset,rankReset); 
schedule.scheduleJob(getPlayersReset,getPlayers);
//setInterval(rankReset, 5000); 
setInterval(refreshData, 120000);

function getResult(match,myPlayer) {
  //console.log(match);
  let roundsPlayed = match.metadata.rounds_played;
  let roundsWinned = 0;
  let roundsLost = 0;
  let allPlayers = match.players.all_players;
  let agentIcon = null;
  let agent = null;
  let kda = null;
  let combatScore = null;
  let hsRate = null;
  let card = null;
  let scoreOfAllPlayers = [];
  //console.log(allPlayers);
  let team = null;
  for (let i = 0; i < allPlayers.length; i++) {
    let player = allPlayers[i];
    let scorePlayer = {
      score: player.stats.score / roundsPlayed,
      team: player.team
    };
    //console.log(player);
    if (player.name === myPlayer.name && player.tag === myPlayer.tag) {
      //console.log("ijfeifje " +player.team);
      //console.log(myPlayer);
      let assets = player.assets;
      let stats = player.stats;
      combatScore = stats.score / roundsPlayed;
      kda = stats.kills + " / " + stats.deaths  + " / " + stats.assists ;
      let allshots = stats.headshots + stats.bodyshots + stats.legshots;
      hsRate = ((stats.headshots / allshots) *100).toFixed(2) + "%";
      team = player.team;   
      agent = player.character;
      agentIcon = assets.agent.small;
      card = assets.card.small;
      //console.log(player);

    }else{
      scoreOfAllPlayers.push(scorePlayer);
    }
  }
  let mvp = isMvp(scoreOfAllPlayers,combatScore,team);
  let allRounds = match.rounds;
  for (let i = 0; i < allRounds.length; i++) {
    let round = allRounds[i];
    if (round.winning_team === team) {
      roundsWinned++;
    } else {
      roundsLost++;
    }
  }
  let result = {
    resultGame : "",
    score : roundsWinned + " - " + roundsLost,
    agent : agent,
    agentIcon : agentIcon,
    kda : kda,
    combatScore : combatScore.toFixed(0) +" " +mvp,
    hsRate : hsRate,
    colorEmbed : null,
    card : card,
  }
  if (roundsWinned > roundsLost) {
    result.resultGame = myLanguageWords.victoryYaml;
    updateRecord(myPlayer, "win");
    result.colorEmbed = 0x00ff00;
  } else if (roundsWinned < roundsLost) {
    result.resultGame = myLanguageWords.defeatYaml;
    updateRecord(myPlayer, "lose");
    result.colorEmbed = 0xff0000;
  } else {
    result.resultGame = myLanguageWords.drawYaml;
    updateRecord(myPlayer, "draw");
    result.colorEmbed = 0xffff00;
  }
  return result;
}

function isMvp(scoreOfAllPlayers,score,team){
  let othersPlayers = 0;
  let opponentPlayers = 0;
  for (let i = 0; i < scoreOfAllPlayers.length; i++) {
    let teamate = scoreOfAllPlayers[i];
    if (teamate.team === team) {
      if (score > teamate.score) {
        othersPlayers++;  
      } 
    }
    if (teamate.team !== team) {
      if (score > teamate.score) {
        opponentPlayers++;
      } 
    }
  }
  if (othersPlayers == 4) {
    if (opponentPlayers == 5) {
      return "⭐";
    }
    else {
      return "★";
    }
  }
  return "";
}


async function updateRecord(player, winOrLose) {
  let attribut = "";
  let score = 0;
  if (winOrLose === "win") {
    attribut = "win";
    player.win++;
    score = player.win;
  } else if (winOrLose === "lose") {
    attribut = "lose";
    player.lose++;
    score = player.lose;
  }
  else{
    attribut = "draw";
    player.draw++;
    score = player.draw;
  }
  //console.log(attribut + " : " + score);
  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: player.name,
      tag: player.tag,
      [attribut]: score,
      id_discord: allDiscords[player.channel_id].id
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
  })
  .catch(error => {
    console.error(error);
  })
}

async function resetRecord(player){
  player.win = 0;
  player.lose = 0;
  player.draw = 0;
  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: player.name,
      tag: player.tag,
      win: 0,
      lose: 0,
      draw: 0,
      id_discord: allDiscords[player.channel_id].id
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
  })
  .catch(error => {
    console.error(error);
  })
}

 let playerTest = {
  name: "Kabraass",
  tag: "972",
  win: 0,
  lose: 1
}
/* resetRecord(playerTest);
console.log(playerTest);

updateRecord(playerTest,"win");
console.log(playerTest); */

//insertPlayer("Kabraass","972");


function matchRankWithEmote(rank) {
  let emojiId = null;
  let emojiName = null;
  switch (rank) {
    case "Unrated": 
      emojiId = emojisRank.unrated.id;
      emojiName = emojisRank.unrated.name;
      break;
    case "Iron 1":
      emojiId = emojisRank.iron1.id;
      emojiName = emojisRank.iron1.name;
      break;
    case "Iron 2":
      emojiId = emojisRank.iron2.id;
      emojiName = emojisRank.iron2.name;
      break;
    case "Iron 3":
      emojiId = emojisRank.iron3.id;
      emojiName = emojisRank.iron3.name;
      break;
    case "Bronze 1":
      emojiId = emojisRank.bronze1.id;
      emojiName = emojisRank.bronze1.name;
      break;
    case "Bronze 2":
      emojiId = emojisRank.bronze2.id;
      emojiName = emojisRank.bronze2.name;
      break;
    case "Bronze 3":
      emojiId = emojisRank.bronze3.id;
      emojiName = emojisRank.bronze3.name;
      break;
    case "Silver 1":
      emojiId = emojisRank.silver1.id;
      emojiName = emojisRank.silver1.name;
      break;
    case "Silver 2":
      emojiId = emojisRank.silver2.id;
      emojiName = emojisRank.silver2.name;
      break;
    case "Silver 3":
      emojiId = emojisRank.silver3.id;
      emojiName = emojisRank.silver3.name;
      break;
    case "Gold 1":
      emojiId = emojisRank.gold1.id;
      emojiName = emojisRank.gold1.name;
      break;
    case "Gold 2":
      emojiId = emojisRank.gold2.id;
      emojiName = emojisRank.gold2.name;
      break;
    case "Gold 3":
      emojiId = emojisRank.gold3.id;
      emojiName = emojisRank.gold3.name;
      break;
    case "Platinum 1":
      emojiId = emojisRank.plat1.id;
      emojiName = emojisRank.plat1.name;
      break;
    case "Platinum 2":
      emojiId = emojisRank.plat2.id;
      emojiName = emojisRank.plat2.name;
      break;
    case "Platinum 3":
      emojiId = emojisRank.plat3.id;
      emojiName = emojisRank.plat3.name;
      break;
    case "Diamond 1":
      emojiId = emojisRank.diamond1.id;
      emojiName = emojisRank.diamond1.name;
      break;
    case "Diamond 2":
      emojiId = emojisRank.diamond2.id;
      emojiName = emojisRank.diamond2.name;
      break;
    case "Diamond 3":
      emojiId = emojisRank.diamond3.id;
      emojiName = emojisRank.diamond3.name;
      break;
    case "Immortal 1":
      emojiId = emojisRank.immortal1.id;
      emojiName = emojisRank.immortal1.name;
      break;
    case "Immortal 2":
      emojiId = emojisRank.immortal2.id;
      emojiName = emojisRank.immortal2.name;
      break;
    case "Immortal 3":
      emojiId = emojisRank.immortal3.id;
      emojiName = emojisRank.immortal3.name;
      break;
    case "Radiant":
      emojiId = emojisRank.radiant.id;  
      emojiName = emojisRank.radiant.name;
      break;
    default:
      break;
  }
  return `<:${emojiName}:${emojiId}>`;
}


async function getDiscordId() {
  await fetch(discordInfosUrl, {
    method: 'GET',
  })
    .then(response => response.json())
    .then(data => {
      //console.log(data);
      for (let i = 0; i < data.length; i++) {
        let disc = data[i];
        allDiscords[disc.channel_id] = {id : disc.id, lang : disc.lang};
        //console.log(allDiscords[disc.channel_id]);
        allGuilds[disc.guild_id] = {id : disc.id, channel_id : disc.channel_id,lang : disc.lang};
        //console.log(allGuilds);
      }
    })
    .catch(error => {
      console.error(error);
    });

}
/* console.log(allDiscords);
 *//* getDiscordId().then(allzaaz => {
  console.log(allDiscords["1247536290266878012"].id);
}); */


async function addDiscordId(guild_id, channel_id) {
  try {
    const response = await fetch(discordInfosUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        guild_id: guild_id,
        channel_id: channel_id,
        lang: "en"
      }),
    });

    const data = await response.json();
    //console.log(data);

    allDiscords[channel_id] = { id: data.id, lang: "en" };
    allGuilds[guild_id] = { id: data.id, channel_id: channel_id, lang: "en" };
    return data;
  } catch (error) {
    console.error(error);
    return false;
  }
}


function removeDiscordId(channel_id, guild_id) {
  fetch(discordInfosUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guild_id: guild_id,
      channel_id: null
    }),
  })
    .then(response => response.json())
    .then(data => {
      //console.log(data);
      delete allDiscords[channel_id];
      allGuilds[guild_id].channel_id = null;
      return data;
    })
    .catch(error => {
      //console.error(error);
      return false;
    });
}

async function updateDiscordId(guild_id,channel_id) {
  const response = await fetch(discordInfosUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      guild_id: guild_id,
      channel_id: channel_id,
      lang: allGuilds[guild_id].lang
    }),
  })
    const data = await response.json();
    if (!data) {
      return false;
    }
    allDiscords[channel_id] = {id : data.id, lang : allGuilds[guild_id].lang};
    allGuilds[guild_id].channel_id = channel_id;
    return data;

}

/* allDiscords["1247536290266878012"] = {id : "54", lang : "en"}
if (allDiscords["1247536290266878012"]){     
  console.log("fezojezzoefijo");
} */
//addDiscordId("929741532817395782", "1247536290266878012");


client.login(
    config.token
  );
  
  
