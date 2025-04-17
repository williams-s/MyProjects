const {UPDATE_MATCH_ID} = require("../../sql/sqlQueries");

async function updateMatchId(player, newMatchId, allDiscords ) {
    const data = await UPDATE_MATCH_ID(player, newMatchId,allDiscords[player.channel_id].id);
    return data.rowCount;
}

module.exports = {
    updateMatchId
};