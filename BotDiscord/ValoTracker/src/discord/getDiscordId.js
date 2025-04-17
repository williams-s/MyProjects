const {GET_ALL_DISCORDS} = require("../../sql/sqlQueries");

async function getDiscordId(allDiscords,allGuilds) {
    const discords = await GET_ALL_DISCORDS();
    const data = discords.rows;
    for (let i = 0; i < data.length; i++) {
        let disc = data[i];
        allDiscords[disc.channel_id] = {id : disc.id, lang : disc.lang};
        //console.log(allDiscords[disc.channel_id]);
        allGuilds[disc.guild_id] = {id : disc.id, channel_id : disc.channel_id,lang : disc.lang};
        //console.log(allGuilds);
    }
}

module.exports = {
    getDiscordId
};

