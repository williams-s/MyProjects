const {GET_ALL_PLAYERS} = require("../../sql/sqlQueries");

async function getPlayers(playersList, listPlayersByChannel) {
    //console.log("get players");
    const players = await GET_ALL_PLAYERS();
    for (let user of players.rows) {
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
    }
    playersList.forEach(player => {
        if (!listPlayersByChannel[player.channel_id]) {
            listPlayersByChannel[player.channel_id] = [];
        }
        listPlayersByChannel[player.channel_id].push(player);
    })
}

module.exports = {
    getPlayers
};