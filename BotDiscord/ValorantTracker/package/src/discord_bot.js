const {rankIndex} = require('./ranksValo.js');
const { Client, GatewayIntentBits, REST, Routes,EmbedBuilder } = require("discord.js");
const { get } = require("express/lib/response");
const schedule = require('node-schedule');
const HenrikDevValorantAPI = require("unofficial-valorant-api");
const fs = require('fs');
const yaml = require('js-yaml');
let configInit = null;

try {
  let config2 = yaml.load(fs.readFileSync('../config/config.yaml', 'utf8'));
  configInit = config2.keys;
} catch (error) {
  console.error(error);
}

const VAPI = new HenrikDevValorantAPI(
  configInit.apiKey
);
const url = 'http://51.20.69.207/valoTracker/package/src/getInfos.php';
const vctLogo = 'http://51.20.69.207/valoTracker/package/images/vctlogo.png';
// Configuration du bot
const config = {
  clientId: configInit.clientId,
  token: configInit.tokken,
  guildId: configInit.guildId,
  channelName: configInit.channelName,
};


const hourReset = "40 14 * * *";
let playersList = [];
let guild = null;
let channel = null; 
getPlayers();

const commands = [
  {
    name: "rank",
    description: "Renvoie le classement du joueur",
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
    name: "add-player",
    description: "Ajoute un joueur a la liste (sans le # et avec les majuscules)",
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
    description: "Retire un joueur de la liste",
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
    description: "Affiche le classement du serveur",
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
  channel = guild.channels.cache.find(c => c.name === config.channelName);
});



client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === "rank") {
    await interaction.deferReply({ ephemeral: false });
    try {
      const mmr_data = await VAPI.getMMR({
        version: "v1",
        region: "eu",
        name: interaction.options.getString('name'),
        tag: interaction.options.getString('tag'),
      });

      // Vérifie la structure des données renvoyées
      if (mmr_data.error) {
        return channel.send(`An error occurred: \n\`\`\`${mmr_data.error}\`\`\``);
      }

      // Formatage des données MMR pour affichage
      const data  = mmr_data.data;
      const rank = data.currenttierpatched;
      const lp = data.ranking_in_tier;
      const images = data.images;
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(`${data.name}#${data.tag}`)
        .setThumbnail(images.small)
        .setURL(`https://tracker.gg/valorant/profile/riot/${data.name}%23${data.tag}/overview`)
        .addFields({ name: "RANK", value: `${rank} ${lp}rr` })
        .setTimestamp();
        interaction.followUp({ embeds: [embed] });
      } catch (error) {
      channel.send(`An error occurred: \n\`\`\`${error.message}\`\`\``);
    }
  }

  if (interaction.commandName === "add-player") {
    await interaction.deferReply({ ephemeral: false });
    try {
      const nameValue = interaction.options.getString('name');
      const tagValue = interaction.options.getString('tag');
      const added = await insertPlayer(nameValue, tagValue);
      //console.log("dzaopazk " + added);
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Ajout du joueur')
        .setDescription(`Joueur ${nameValue}#${tagValue} ajoute`)
        .setTimestamp();
      if (added) {
        interaction.followUp({ embeds: [embed] });
      }
      else {
        //embed.setDescription(`Joueur ${nameValue}#${tagValue} existe déja`)
        interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }

  if (interaction.commandName === "remove-player") {
    await interaction.deferReply({ ephemeral: false });
    try {
      const nameValue = interaction.options.getString('name');
      const tagValue = interaction.options.getString('tag');
      const deleted = await deletePlayer(nameValue, tagValue);
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Suppression du joueur')
        .setDescription(`Joueur ${nameValue}#${tagValue} supprime`)
        .setTimestamp();
      //console.log("dzaopazk " + deleted);
      if (deleted) {
        interaction.followUp({ embeds: [embed] });
      }
      else {
        embed.setDescription(`Joueur ${nameValue}#${tagValue} n'existe pas`)
        interaction.followUp({ embeds: [embed] });
      }
    } catch (error) {
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }

  if (interaction.commandName === "leaderboard") {
    await interaction.deferReply({ ephemeral: false });
    try {
      await sortList(); 
      const leaderboard = playersList;
      //console.log(leaderboard);
      let description = "";
      for(let i = 0; i < leaderboard.length; i++) {
        let player = leaderboard[i];
        description += `${i+1}. ${player.name}#${player.tag} - ${player.tier} ${player.rr}rr\n`;
      }
      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Leaderboard')
        .setDescription(description)
        .setTimestamp();
      interaction.followUp({ embeds: [embed] });
    } catch (error) {
      interaction.editReply({ content: `An error occurred: \n\`\`\`${error.message}\`\`\`` });
    }
  }
});



async function refreshData() {
    console.log("Refreshing data..."); 
    for (let i = 0; i < playersList.length; i++) {
      let player = playersList[i];
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
            verbForResult = "gagner";
          }
          else if (lpGain < 0) {
            verbForResult = "perdre";
          }
          else {
            verbForResult = "prendre";
          }
          if (player.lastMatchId !== matchId) {
            updateMatchId(player,matchId);
            //console.log("Match id updated");
            try {
              const match = await VAPI.getMatches({region: "eu", name: player.name, tag: player.tag});
              let result = getResult(match.data[0],player.name,player.tag);
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
              //console.log(match.data[0].metadata.matchid + " ===== " + matchId);
              //console.log(match.data[0].metadata);
              if (match.data[0].metadata.matchid === matchId) {
                console.log("Match found");
                updateRank(player.name, player.tag, rank, lp);
                const embed = new EmbedBuilder()
                .setColor(colorEmbed)
                .setTitle(`${resultGame}`) 
                .setThumbnail(agentIcon)
                .setDescription(`${player.name}#${player.tag} vient de ${verbForResult} **${lpGain}rr** ! \n Rank actuel :  **${rank}  ${lp}rr**`)
                .setURL(`https://tracker.gg/valorant/profile/riot/${player.name}%23${player.tag}/overview`)
                .addFields(
                    { name: 'Score', value: `${score}`, inline: true },
                    { name: 'Map', value: `${map}`, inline: true },
                    { name: 'Agent', value: `**${agent}**`, inline: true },
                    { name: 'Score de Combat', value: `${combatScore}`, inline: true },
                    { name: 'Headshot %', value: `${hsRate}`, inline: true },
                    { name: 'KDA', value: `${kda}`, inline: true },
                )
                .setTimestamp();

            // Chercher le canal par nom
            const guild = client.guilds.cache.get(config.guildId); // On suppose que le bot est dans au moins une guilde
            const channel = guild.channels.cache.find(c => c.name === config.channelName);
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

async function getPlayers() {
  playersList = [];
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
            elo : user.elo
          }
          playersList.push(playerInfo);
        });
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
    })
  })
  .then(response => {
    // Lire la réponse comme texte brut
    return response.text().then(text => {
      // Vérifier si la réponse est un JSON valide
      try {
        const data = JSON.parse(text);
        //console.log(data);
        for (let i = 0; i < playersList.length; i++) {
          if (playersList[i].name === player.name && playersList[i].tag === player.tag) {
            playersList[i].lastMatchId = newMatchId;
            break;
          }
        }
      } catch (e) {
        console.error("Erreur lors de la conversion de la réponse en JSON:", e);
        console.log("Réponse brute:", text);
      }
    });
  })
  .catch(error => console.error("Erreur lors de l'appel fetch:", error));

}

async function insertPlayer(nameValue,tagValue) {
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
    fetch(url, {
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
        elo: elo
      })
    })
      .then(response => {
        // Lire la réponse comme texte brut
        return response.text().then(text => {
          // Vérifier si la réponse est un JSON valide
          try {
            const data = JSON.parse(text);
            //console.log(data);
            playersList.push({name: nameValue, tag: tagValue, lastMatchId: matchId, tier: rank, rr: lp, elo: elo});
            return true;
          } catch (e) {
            console.error("Erreur lors de la conversion de la réponse en JSON:", e);
            console.log("Réponse brute:", text);
            return false;
          }
        });
      })
      .catch(error => console.error("Erreur lors de l'appel fetch:", error));
    
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function deletePlayer(nameValue, tagValue) {
  return fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: nameValue,
      tag: tagValue
    })
  })
  .then(response => response.json())
  .then(data => {
    //console.log(data);
    if (data > 0) {
      //console.log("Joueur supprimé");
      for (let i = 0; i < playersList.length; i++) {
        if (playersList[i].name === nameValue && playersList[i].tag === tagValue) {
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

async function updateRank(playerName, playerTag, newRank, newLP) {
  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: playerName,
      tag: playerTag,
      tier: newRank,
      rr: newLP
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

async function updateElo(playerName, playerTag, newElo) {
  fetch(url  , {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nom: playerName,
      tag: playerTag,
      elo: newElo
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
  let description = "";
  let elo = null;
  let lp = null;
  let rank = null;
  sortList();
  for (let i = 0; i < playersList.length; i++) {
    let player = playersList[i];
    elo = player.elo;
    lp = player.rr;
    rank = player.tier;
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
        let sign = "+";
        if (diff < 0) {
          sign = "-";
        }
        description += `**${capitalizeFirstLetter(player.name)}#${player.tag} : ${sign}${Math.abs(diff)}** 
        ${rank} ${lp}rr -> ${rankNew} ${lpNew}rr \n \n`;
        updateElo(player.name, player.tag, eloNew);
      } catch (error) {
        console.error(error);
      }
    }
  }
  const embed = new EmbedBuilder()
    .setColor(0xA020F0)
    .setThumbnail(vctLogo)
    .setTitle('Daily Summary')
    .setDescription(`Summary for the past 23 hours : \n\n ${description}`)
    .setTimestamp();
  channel.send({ embeds: [embed] });
}

const job = schedule.scheduleJob(hourReset,rankReset); 

setInterval(refreshData, 120000);

function getResult(match,playerName,playerTag) {
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
  //console.log(allPlayers);
  let team = null;
  for (let i = 0; i < allPlayers.length; i++) {
    let player = allPlayers[i];
    //console.log(player);
    if (player.name === playerName && player.tag === playerTag) {
      //console.log("ijfeifje " +player.team);
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
      break;
    }
  }
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
    combatScore : combatScore.toFixed(0),
    hsRate : hsRate,
    colorEmbed : null,
    card : card,
  }
  if (roundsWinned > roundsLost) {
    result.resultGame = "Victoire";
    result.colorEmbed = 0x00ff00;
  } else if (roundsWinned < roundsLost) {
    result.resultGame = "Defaite";
    result.colorEmbed = 0xff0000;
  } else {
    result.resultGame = "Egalite";
    result.colorEmbed = 0xffff00;
  }
  return result;
}


client.login(
    config.token
  );
  
  
