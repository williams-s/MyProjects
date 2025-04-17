const {UPDATE_ELO,UPDATE_RANK} = require("../../sql/sqlQueries");


async function updateRank(player, newRank, newLP, allDiscords) {
    await UPDATE_RANK(player, newRank, newLP,allDiscords[player.channel_id].id);
}

async function updateElo(player,newElo,newRank, newRr, allDiscords) {
    await UPDATE_ELO(player,newElo,newRank, newRr,allDiscords[player.channel_id].id);
}

module.exports = {
    updateRank,
    updateElo
};