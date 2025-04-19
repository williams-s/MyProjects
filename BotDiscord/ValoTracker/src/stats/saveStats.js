const {SAVE_STATS_FROM_MATCH} = require("../../sql/sqlQueries");
const saveStats = async (stats) => {
    const data = await SAVE_STATS_FROM_MATCH(stats);
    return data.rowCount;
}

module.exports = {
    saveStats
};
