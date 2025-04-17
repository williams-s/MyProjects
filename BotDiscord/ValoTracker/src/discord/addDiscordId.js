const {ADD_DISCORD} = require("../../sql/sqlQueries");

async function addDiscordId(guild_id, channel_id, allGuilds, allDiscords) {
    const discord = {
        guild_id: guild_id,
        channel_id: channel_id,
        lang: "en"
    };
    try {
        const data = await ADD_DISCORD(discord)
        allDiscords[channel_id] = { id: data.id, lang: "en" };
        allGuilds[guild_id] = { id: data.id, channel_id: channel_id, lang: "en" };
        return true;
    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    addDiscordId
};