const {UPDATE_RECORD, RESET_RECORD} = require("../../sql/sqlQueries");

async function updateRecord(player, winOrLose, allDiscords) {
    let attribut;
    let score;
    if (winOrLose === "win") {
        attribut = "win";
        player.win++;
        score = player.win;
    } else if (winOrLose === "lose") {
        attribut = "lose";
        player.lose++;
        score = player.lose;
    }
    else{
        attribut = "draw";
        player.draw++;
        score = player.draw;
    }
    await UPDATE_RECORD(player,attribut,score,allDiscords[player.channel_id].id);

}


async function resetRecord(player, allDiscords) {
    player.win = 0;
    player.lose = 0;
    player.draw = 0;
    await RESET_RECORD(player,allDiscords[player.channel_id].id);

}


module.exports = {
    updateRecord,
    resetRecord
}