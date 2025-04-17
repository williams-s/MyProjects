const {UPDATE_DISCORD_ID} = require("../../sql/sqlQueries");

async function updateLang(lang,guildID,channelID,allGuilds,allDiscords) {
    try {
        await UPDATE_DISCORD_ID(channelID,guildID,lang);
        allDiscords[channelID].lang = lang;
        allGuilds[guildID].lang = lang;
        return true;
    }catch (e) {
        console.error(e);
        return false;
    }
}

module.exports = {
    updateLang
};