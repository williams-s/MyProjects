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
            //past_rank : rank,
            //past_rr : lp,
            win: 0,
            lose: 0,
            draw: 0,
            id_discord: allDiscords[channelID].id
        }
        try {
            const data = await ADD_PLAYER(player,allDiscords[channelID].id);
            //console.log(data);
            if (data === "new server") {
                for (let i = 0; i < playersList.length; i++) {
                    if (playersList[i].name.toLowerCase() === nameValue.toLowerCase() && playersList[i].tag.toLowerCase() === tagValue.toLowerCase()) {
                        playersList[i].channel_ids.push(channelID);
                        //console.log(playersList[i]);
                        //console.log(playersList,listPlayersByChannel);
                        if (!listPlayersByChannel[channelID]) {
                            listPlayersByChannel[channelID] = [];
                        }
                        listPlayersByChannel[channelID].push(playersList[i]);
                        return 1;
                    }
                }
                return 0;
            }
            if (data == false) {
                return data;
            }
            let playerInfo = {
                name: nameValue.toLowerCase(),
                tag: tagValue,
                lastMatchId: matchId,
                tier: rank,
                rr: lp,
                elo: elo,
                //past_rank: rank,
                //past_rr: lp,
                win: 0,
                lose: 0,
                draw: 0,
                channel_ids: [channelID]
            }
            playersList.push(playerInfo);
            if (!listPlayersByChannel[channelID]) {
                listPlayersByChannel[channelID] = [];
            }
            listPlayersByChannel[channelID].push(playerInfo);
            //console.log(playersList,listPlayersByChannel);
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