const {GET_ALL_PLAYERS} = require("../../sql/sqlQueries");

async function getPlayers(playersList, listPlayersByChannel) {
    //console.log("get players");
    playersList.length = 0;
    Object.keys(listPlayersByChannel).forEach(key => delete listPlayersByChannel[key]);
    const players = await GET_ALL_PLAYERS();
    //console.log(players);
    for (let user of players.rows) {
        //console.log(user);
        let playerInfo = {
            name: user.nom,
            tag: user.tag,
            lastMatchId: user.matchId,
            tier : user.tier,
            rr : user.rr,
            elo : user.elo,
            win: user.win,
            lose: user.lose,
            draw: user.draw,
            channel_ids: user.channel_ids,
        }
        playersList.push(playerInfo);
    }
    playersList.forEach(player => {
        for (let i = 0; i < player.channel_ids.length; i++) {
            if (!listPlayersByChannel[player.channel_ids[i]]) {
                listPlayersByChannel[player.channel_ids[i]] = [];
            }
            listPlayersByChannel[player.channel_ids[i]].push(player);
        }
    })
}

module.exports = {
    getPlayers
};