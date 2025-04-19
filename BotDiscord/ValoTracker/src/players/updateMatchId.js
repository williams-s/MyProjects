const {UPDATE_MATCH_ID} = require("../../sql/sqlQueries");

async function updateMatchId(player, newMatchId ) {
    const data = await UPDATE_MATCH_ID(player, newMatchId);
    return data.rowCount;
}

module.exports = {
    updateMatchId
};