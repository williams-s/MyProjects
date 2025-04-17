const {updateMatchId} = require("../players/updateMatchId");
const {updateRank} = require("./updateRanks");
const {EmbedBuilder} = require("discord.js");
const {matchRankWithEmote} = require("../utils/matchRankWithEmote");
const {setLang} = require("../languages/translate");
const {updateRecord} = require("../records/operationsOnRecords");
const {capitalizeFirstLetter} = require("../utils/firstLetterUppercase");

async function refreshData(allDiscords, listPlayersByChannel, VAPI,myLanguageWords,client) {
    //console.log("refreshData...");
    for (let channel_id in listPlayersByChannel) {
        await setLang(allDiscords[channel_id].lang,myLanguageWords);
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
                    if (await updateMatchId(player,matchId,allDiscords)){
                        //console.log("Match id updated");
                        player.lastMatchId = matchId;
                    }
                    try {
                        //const match = await VAPI.getMatches({region: "eu", name: player.name, tag: player.tag});
                        const match = await VAPI.getMatch({match_id: matchId});
                        //console.log(match.data);
                        let result = getResult(match.data,player,allDiscords,myLanguageWords);
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
                        //console.log(result);
                        if (match.data.metadata.matchid === matchId) {
                            //console.log("Match found");
                            updateRank(player, rank, lp, allDiscords);
                            let emote = matchRankWithEmote(rank);
                            const embed = new EmbedBuilder()
                                .setColor(colorEmbed)
                                .setTitle(`${resultGame}`)
                                .setThumbnail(agentIcon)
                                .setDescription(`${capitalizeFirstLetter(player.name)}#${player.tag.toUpperCase()} ${verbForResult} **${lpGain}rr** ! \n ${myLanguageWords.actualRankYaml}: ${emote}  **${rank}  ${lp}rr**`)
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

function getResult(match,myPlayer,allDiscords,myLanguageWords) {
    //console.log(match.metadata);
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

        if (player.name.toLowerCase() === myPlayer.name.toLowerCase() && player.tag.toLowerCase() === myPlayer.tag.toLowerCase()) {
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
        updateRecord(myPlayer, "win",allDiscords);
        result.colorEmbed = 0x00ff00;
    } else if (roundsWinned < roundsLost) {
        result.resultGame = myLanguageWords.defeatYaml;
        updateRecord(myPlayer, "lose",allDiscords);
        result.colorEmbed = 0xff0000;
    } else {
        result.resultGame = myLanguageWords.drawYaml;
        updateRecord(myPlayer, "draw",allDiscords);
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

module.exports = {
    refreshData
};