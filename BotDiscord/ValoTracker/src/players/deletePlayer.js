const {DELETE_PLAYER} = require("../../sql/sqlQueries");

async function deletePlayer(nameValue,tagValue,channelID,allDiscords,playersList,listPlayersByChannel) {
    const data = await DELETE_PLAYER(nameValue.toLowerCase(),tagValue,allDiscords[channelID].id);
    if (data.rowCount > 0) {
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].name === nameValue && playersList[i].tag === tagValue && playersList[i].channel_id === channelID) {
                playersList.splice(i, 1);
                break;
            }
        }
        for (let i = 0; i < listPlayersByChannel[channelID].length; i++) {
            if (listPlayersByChannel[channelID][i].name === nameValue && listPlayersByChannel[channelID][i].tag === tagValue) {
                listPlayersByChannel[channelID].splice(i, 1);
                break;
            }
        }
        return true;
    } else {
        return false;
    }
}

module.exports = {
    deletePlayer
};