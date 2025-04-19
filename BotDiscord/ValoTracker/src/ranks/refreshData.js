const {updateMatchId} = require("../players/updateMatchId");
const {EmbedBuilder} = require("discord.js");
const {matchRankWithEmote} = require("../utils/matchRankWithEmote");
const {setLang} = require("../languages/translate");
const {capitalizeFirstLetter} = require("../utils/firstLetterUppercase");
const {saveStats} = require("../stats/saveStats");

async function refreshData(allDiscords, players, VAPI,myLanguageWords,client) {
    //console.log("refreshData...");
    //console.log("players : " + players.length);
    //for (let player in players) {
        //await setLang(allDiscords[player].lang,myLanguageWords);
        //let players = players[player];
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
                const elo = lastGame.elo;
                //console.log(lastGame);
                if (player.lastMatchId !== matchId) {
                    //console.log("Last match id : " + player.lastMatchId + " - " + matchId);
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
                        let kills = result.kills;
                        let deaths = result.deaths;
                        let assists = result.assists;
                        let win = result.win;
                        let lose = result.lose;
                        let draw = result.draw;
                        //console.log("dkzodkzo " + combatScore);
                        let hsRate = result.hsRate;
                        let colorEmbed = result.colorEmbed;
                        let acs = result.acs;
                        player.rr = lp;
                        player.tier = rank;
                        //console.log(match.data[0].metadata.matchid + " ===== " + matchId);
                        //console.log(match.data[0].metadata);
                        //console.log(result);
                        if (match.data.metadata.matchid === matchId) {
                            //console.log("Match found");
                            if (await updateMatchId(player,matchId)){
                                //console.log("Match id updated");
                                player.lastMatchId = matchId;
                                const stats = {
                                    nom: player.name,
                                    tag: player.tag,
                                    matchid: matchId,
                                    win: win,
                                    lose: lose,
                                    draw: draw,
                                    kills: kills,
                                    deaths: deaths,
                                    assists: assists,
                                    hs: parseFloat(hsRate.replace('%', '')),
                                    acs: acs,
                                    tier: rank,
                                    rr: lp,
                                    //past_rank: player.past_rank,
                                    //past_rr: player.past_rr,
                                    elo: elo
                                }
                                await saveStats(stats);
                            }
                            //updateRank(player, rank, lp, allDiscords);
                            let emote = matchRankWithEmote(rank);
                            for (let i = 0; i < player.channel_ids.length; i++) {
                                let channelId = player.channel_ids[i];
                                let channel = client.channels.cache.get(channelId);
                                await setLang(allDiscords[channelId].lang,myLanguageWords)
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
                                if (channel) {
                                    channel.send({ embeds: [embed] });
                                } else {
                                    console.error('Channel not found');
                                }
                            }
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }
    //}
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
    let kills = null;
    let deaths = null;
    let assists = null;
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
            kills = stats.kills;
            deaths = stats.deaths;
            assists = stats.assists;
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
        kills : kills,
        deaths : deaths,
        assists : assists,
        combatScore : combatScore.toFixed(0) +" " +mvp,
        acs : combatScore.toFixed(2),
        hsRate : hsRate,
        colorEmbed : null,
        card : card,
        win : 0,
        lose : 0,
        draw : 0
    }
    if (roundsWinned > roundsLost) {
        result.resultGame = myLanguageWords.victoryYaml;
        result.win = 1;
        //updateRecord(myPlayer, "win",allDiscords);
        result.colorEmbed = 0x00ff00;
    } else if (roundsWinned < roundsLost) {
        result.resultGame = myLanguageWords.defeatYaml;
        result.lose = 1;
        //updateRecord(myPlayer, "lose",allDiscords);
        result.colorEmbed = 0xff0000;
    } else {
        result.resultGame = myLanguageWords.drawYaml;
        result.draw = 1;
        //updateRecord(myPlayer, "draw",allDiscords);
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