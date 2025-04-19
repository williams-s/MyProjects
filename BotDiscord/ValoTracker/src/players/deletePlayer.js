const {DELETE_PLAYER} = require("../../sql/sqlQueries");

async function deletePlayer(nameValue,tagValue,channelID,allDiscords,playersList,listPlayersByChannel) {
    const data = await DELETE_PLAYER(nameValue.toLowerCase(),tagValue,allDiscords[channelID].id);
    if (data.rowCount > 0) {
        for (let i = 0; i < playersList.length; i++) {
            if (playersList[i].name.toLowerCase() === nameValue.toLowerCase() && playersList[i].tag.toLowerCase() === tagValue.toLowerCase()) {
                playersList[i].channel_ids.splice(playersList[i].channel_ids.indexOf(channelID), 1);
                if (playersList[i].channel_ids.length === 0) {
                    playersList.splice(i, 1);
                }
                break;
            }
        }
        for (let i = 0; i < listPlayersByChannel[channelID].length; i++) {
            //console.log(listPlayersByChannel[channelID][i]);
            if (listPlayersByChannel[channelID][i].name.toLowerCase() === nameValue.toLowerCase() && listPlayersByChannel[channelID][i].tag.toLowerCase() === tagValue.toLowerCase()) {
                listPlayersByChannel[channelID].splice(i, 1);
                break;
            }
        }
        //console.log(listPlayersByChannel[channelID]);
        return true;
    } else {
        return false;
    }
}

module.exports = {
    deletePlayer
};