const {setLang} = require("../languages/translate");
const {sortList} = require("../utils/sortList");
const {updateElo} = require("./updateRanks");
const {resetRecord} = require("../records/operationsOnRecords");
const {EmbedBuilder} = require("discord.js");
const {capitalizeFirstLetter} = require("../utils/firstLetterUppercase");

async function rankReset(allDiscords,listPlayersByChannel,VAPI,myLanguageWords,client,vctLogo){
    //console.log("rankReset");
    let description = "";
    let elo = null;
    let lp = null;
    let rank = null;
    let past_rr;
    let past_rank;
    for (let channel_id in listPlayersByChannel) {
        description = "";
        await setLang(allDiscords[channel_id].lang, myLanguageWords);
        let players = listPlayersByChannel[channel_id];
        if (players) {
            await sortList(players);
            for (let i = 0; i < players.length; i++) {
                let player = players[i];
                const win = Number(player.win);
                const lose = Number(player.lose);
                const draw = Number(player.draw);
                if (lose === 0 && win === 0 && draw === 0) {

                } else {
                    elo = player.elo;
                    lp = player.rr;
                    rank = player.tier;
                    past_rank = player.past_rank;
                    past_rr = player.past_rr;
                    if (elo == null) {
                        //console.log("Elo non renseigné");
                    } else {
                        try {
                            const mmr_data = await VAPI.getMMRHistory({
                                region: "eu",
                                name: player.name,
                                tag: player.tag,
                            });
                            if (mmr_data.error) {
                                console.error(mmr_data.error);
                            }
                            const dataString = JSON.parse(JSON.stringify(mmr_data.data));
                            const lastGame = dataString[0];
                            const rankNew = lastGame.currenttierpatched;
                            const lpNew = lastGame.ranking_in_tier;
                            const eloNew = lastGame.elo;
                            const diff = eloNew - elo;

                            let record = "";
                            if (win !== 0) {
                                record += `${win} win(s) `;
                            }
                            if (lose !== 0) {
                                record += `${lose} loss(es) `;
                            }
                            if (draw !== 0) {
                                record += `${draw} draw(s)`;
                            }
                            const allgames = win + lose + draw;
                            const winrate = (win / allgames) * 100;
                            let sign = "+";
                            if (diff < 0) {
                                sign = "-";
                            }
                            description += `**${capitalizeFirstLetter(player.name)}#${player.tag.toUpperCase()} : ${sign}${Math.abs(diff)}** 
              ${capitalizeFirstLetter(past_rank)} ${past_rr}rr -> ${capitalizeFirstLetter(rankNew)} ${lpNew}rr 
              (${allgames} game(s) : ${record} | ${winrate.toFixed(2)}% winrate) \n \n`;
                            updateElo(player, eloNew, rank, lp, allDiscords);
                        } catch (error) {
                            console.error(error);
                        }
                    }
                }
                resetRecord(player, allDiscords);
            }
            let channel = client.channels.cache.get(channel_id);
            const embed = new EmbedBuilder()
                .setColor(0xA020F0)
                .setThumbnail('attachment://vctLogo.png')
                .setTitle('Daily Summary')
                .setDescription(`${myLanguageWords.dailySummarySubtitleYaml} : \n\n ${description}`)
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
