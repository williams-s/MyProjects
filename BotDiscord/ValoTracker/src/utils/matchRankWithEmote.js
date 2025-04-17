const {emojisRank} = require("../../config/config");

function matchRankWithEmote(rank) {
    let emojiId = null;
    let emojiName = null;
    switch (rank) {
        case "Unrated":
            emojiId = emojisRank.unrated.id;
            emojiName = emojisRank.unrated.name;
            break;
        case "Iron 1":
            emojiId = emojisRank.iron1.id;
            emojiName = emojisRank.iron1.name;
            break;
        case "Iron 2":
            emojiId = emojisRank.iron2.id;
            emojiName = emojisRank.iron2.name;
            break;
        case "Iron 3":
            emojiId = emojisRank.iron3.id;
            emojiName = emojisRank.iron3.name;
            break;
        case "Bronze 1":
            emojiId = emojisRank.bronze1.id;
            emojiName = emojisRank.bronze1.name;
            break;
        case "Bronze 2":
            emojiId = emojisRank.bronze2.id;
            emojiName = emojisRank.bronze2.name;
            break;
        case "Bronze 3":
            emojiId = emojisRank.bronze3.id;
            emojiName = emojisRank.bronze3.name;
            break;
        case "Silver 1":
            emojiId = emojisRank.silver1.id;
            emojiName = emojisRank.silver1.name;
            break;
        case "Silver 2":
            emojiId = emojisRank.silver2.id;
            emojiName = emojisRank.silver2.name;
            break;
        case "Silver 3":
            emojiId = emojisRank.silver3.id;
            emojiName = emojisRank.silver3.name;
            break;
        case "Gold 1":
            emojiId = emojisRank.gold1.id;
            emojiName = emojisRank.gold1.name;
            break;
        case "Gold 2":
            emojiId = emojisRank.gold2.id;
            emojiName = emojisRank.gold2.name;
            break;
        case "Gold 3":
            emojiId = emojisRank.gold3.id;
            emojiName = emojisRank.gold3.name;
            break;
        case "Platinum 1":
            emojiId = emojisRank.plat1.id;
            emojiName = emojisRank.plat1.name;
            break;
        case "Platinum 2":
            emojiId = emojisRank.plat2.id;
            emojiName = emojisRank.plat2.name;
            break;
        case "Platinum 3":
            emojiId = emojisRank.plat3.id;
            emojiName = emojisRank.plat3.name;
            break;
        case "Diamond 1":
            emojiId = emojisRank.diamond1.id;
            emojiName = emojisRank.diamond1.name;
            break;
        case "Diamond 2":
            emojiId = emojisRank.diamond2.id;
            emojiName = emojisRank.diamond2.name;
            break;
        case "Diamond 3":
            emojiId = emojisRank.diamond3.id;
            emojiName = emojisRank.diamond3.name;
            break;
        case "Immortal 1":
            emojiId = emojisRank.immortal1.id;
            emojiName = emojisRank.immortal1.name;
            break;
        case "Immortal 2":
            emojiId = emojisRank.immortal2.id;
            emojiName = emojisRank.immortal2.name;
            break;
        case "Immortal 3":
            emojiId = emojisRank.immortal3.id;
            emojiName = emojisRank.immortal3.name;
            break;
        case "Radiant":
            emojiId = emojisRank.Radiant.id;
            emojiName = emojisRank.Radiant.name;
            break;
        default:
            break;
    }
    return `<:${emojiName}:${emojiId}>`;
}

module.exports = {
    matchRankWithEmote
};