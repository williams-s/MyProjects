const {setLang} = require("../languages/translate");
const {sortList} = require("../utils/sortList");
const {EmbedBuilder} = require("discord.js");
const {capitalizeFirstLetter} = require("../utils/firstLetterUppercase");
const {GET_SUMMARY} = require("../../sql/sqlQueries");
const {set} = require("express/lib/application");

async function rankReset(allDiscords,VAPI,myLanguageWords,client,vctLogo,period,periodSummaryTitle="Daily Summary") {
    //console.log("rankReset");
    let description = "";
    let subTitle;
    const data = await GET_SUMMARY(period);
    const playersSummary = data.rows;
    //console.log(playersSummary);
    let listPlayersByChannel = {};
    for (let i = 0; i < playersSummary.length; i++) {
        let player = playersSummary[i];
        let channel_ids = player.channel_ids;
        for (let i = 0; i < channel_ids.length; i++) {
            let channel_id = channel_ids[i];
            //console.log(channel_id);
            if (!listPlayersByChannel[channel_id]) {
                listPlayersByChannel[channel_id] = [];
            }
            listPlayersByChannel[channel_id].push(player);
        }
    }
    //console.log(listPlayersByChannel);
    for (let channel_id in listPlayersByChannel) {
        description = "";
        await setLang(allDiscords[channel_id].lang, myLanguageWords);
        if (periodSummaryTitle === "Daily Summary") {
            subTitle = myLanguageWords.dailySummarySubtitleYaml;
        }
        if (periodSummaryTitle === "Weekly Summary") {
            subTitle = myLanguageWords.weeklySummarySubtitleYaml;
        }
        if (periodSummaryTitle === "Monthly Summary") {
            subTitle = myLanguageWords.monthlySummarySubtitleYaml;
        }
        let players = listPlayersByChannel[channel_id];
        if (players) {
            await sortList(players);
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                const wins = Number(player.wins);
                const loses = Number(player.loses);
                const draws = Number(player.draws);
                let record = "";
                if (wins !== 0) {
                    record += `${wins} win(s) `;
                }
                if (loses !== 0) {
                    record += `${loses} loss(es) `;
                }
                if (draws !== 0) {
                    record += `${draws} draw(s)`;
                }
                const allgames = wins + loses + draws;
                const hsRate = Number(player.hs).toFixed(2) + "%";
                const acs = Number(player.acs).toFixed(2);
                const kills = player.kills;
                const deaths = player.deaths;
                const assists = player.assists;
                const kda = kills + " / " + deaths + " / " + assists;
                const avgKills = Number(player.avg_kills).toFixed(2);
                const avgDeaths = Number(player.avg_deaths).toFixed(2);
                const avgAssists = Number(player.avg_assists).toFixed(2);
                const avgKda = avgKills + " / " + avgDeaths + " / " + avgAssists;
                const current_tier = player.current_tier;
                const current_rr = player.current_rr;
                const current_elo = player.current_elo;
                const previous_tier = player.previous_tier;
                const previous_rr = player.previous_rr;
                const previous_elo = player.previous_elo;

                const diff = Number(current_elo) - Number(previous_elo);

                const winrate = (wins / allgames) * 100;
                let sign = "+";
                if (diff < 0) {
                    sign = "-";
                }
                description += `**${capitalizeFirstLetter(player.nom)}#${player.tag.toUpperCase()} : ${sign}${Math.abs(diff)}**\n`;
                description += `**${capitalizeFirstLetter(previous_tier)} ${previous_rr}rr -> ${capitalizeFirstLetter(current_tier)} ${current_rr}rr**\n`;
                description += `Avg Headshot % : ${hsRate} | Avg ACS : ${acs}\n`;
                description += `KDA : ${kda} | Avg KDA : ${avgKda}\n`;
                description += `${allgames} game(s) : ${record} | ${winrate.toFixed(2)}% winrate\n\n`;
            }
            let channel = client.channels.cache.get(channel_id);
            const embed = new EmbedBuilder()
                .setColor(0xA020F0)
                .setThumbnail('attachment://vctLogo.png')
                .setTitle(periodSummaryTitle)
                .setDescription(`${subTitle} : \n\n ${description}`)
                .setTimestamp();
            //console.log(description);
            if (description !== "") {
                channel.send({
                    embeds: [embed],
                    files: [{ attachment: vctLogo, name: 'vctLogo.png' }],
                });
            } else {
                //console.log(description);
            }
        }
    }
}

module.exports = {
    rankReset
};
