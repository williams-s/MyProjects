const {EmbedBuilder} = require("discord.js");
const {matchRankWithEmote} = require('../utils/matchRankWithEmote');
async function getAccount(name,tag,VAPI,myLanguageWords) {
    let data = await VAPI.getAccount({
        name: name,
        tag: tag
    });
    data = data.data;
    if (data === null) {
        return null
    }
    let data2 = await VAPI.getMMRByPUUID({
        version: "v1",
        region: "eu",
        puuid: data.puuid,
    });
    data2 = data2.data;
    card = data.card;
    let rank = data2.currenttierpatched;
    const tab = {
        name : data.name,
        tag : data.tag,
        level : data.account_level,
        rank : rank,
        cardIcon : card.large,
        cardSmall : card.small,
        lp : data2.ranking_in_tier + " rr",
        mmr_gain : data2.mmr_change_to_last_game,
        rankIcon : matchRankWithEmote(rank),
    }
    if (tab.mmr_gain >= 0) {
        tab.mmr_gain = "+" + tab.mmr_gain;
    }
    else {
        tab.mmr_gain = tab.mmr_gain.toString();
    }
    const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle(tab.name + "#" + tab.tag)
        .setURL(`https://tracker.gg/valorant/profile/riot/${tab.name}%23${tab.tag}/overview`)
        .addFields(
            { name: 'Level', value: tab.level.toString(), inline: true },
            { name: 'Rank', value: tab.rankIcon + " " + tab.rank + " " + tab.lp, inline: true },
            { name: myLanguageWords.lastGame, value: tab.mmr_gain, inline: false },
        )
        .setThumbnail(tab.cardSmall);
    return embed
}

module.exports = {
    getAccount
};