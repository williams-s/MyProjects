const {ADD_PLAYER} = require("../../sql/sqlQueries");
async function insertPlayer(nameValue,tagValue,guildID,channelID,VAPI,playersList,listPlayersByChannel,allDiscords) {
    try {
        const mmr_data = await VAPI.getMMRHistory({
            region: "eu",
            name: nameValue,
            tag: tagValue,
        });
        if (mmr_data.error) {
            console.error(mmr_data.error);
            return -2;
        }
        const dataString = JSON.parse(JSON.stringify(mmr_data.data));
        const lastGame = dataString[0];
        const matchId = lastGame.match_id;
        const rank = lastGame.currenttierpatched;
        const lp = lastGame.ranking_in_tier;
        const elo = lastGame.elo;
        const player = {
            matchId: matchId,
            nom: nameValue.toLowerCase(),
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
        }
        try {
            const data = await ADD_PLAYER(player);
            //console.log(data);
            let playerInfo = {name: nameValue.toLowerCase(), tag: tagValue, lastMatchId: matchId, tier: rank, rr: lp, elo: elo, past_rank: rank, past_rr: lp, win: 0, lose: 0, draw: 0,guild_id: guildID,channel_id: channelID}
            playersList.push(playerInfo);
            if (!listPlayersByChannel[playerInfo.channel_id]) {
                listPlayersByChannel[playerInfo.channel_id] = [];
            }
            listPlayersByChannel[playerInfo.channel_id].push(playerInfo);
            //console.log(listPlayersByChannel[playerInfo.channel_id]);
            //console.log(data);
            return data.rowCount;
        } catch (e) {
            console.error("Erreur lors de la conversion de la réponse en JSON:", e);
            return false;
        }
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {insertPlayer};