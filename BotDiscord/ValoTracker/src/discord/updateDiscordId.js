const {UPDATE_DISCORD_ID} = require("../../sql/sqlQueries");

async function updateDiscordId(guild_id,channel_id,allGuilds,allDiscords) {
    const data = await UPDATE_DISCORD_ID(channel_id,guild_id,allGuilds[guild_id].lang);
    if (data.rows === []) {
        return false;
    }
    allDiscords[channel_id] = {id : data.rows[0].id , lang : allGuilds[guild_id].lang};
    allGuilds[guild_id].channel_id = channel_id;
    return true;
}

module.exports = {
    updateDiscordId
};