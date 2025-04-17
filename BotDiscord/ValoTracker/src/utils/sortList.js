const {rankIndex} = require("./ranksValo");

async function sortList(list) {
    list.sort((a, b) => {
        const rankComparison = rankIndex(b.tier) - rankIndex(a.tier);
        if (rankComparison !== 0) {
            return rankComparison;
        }
        return b.rr - a.rr;
    })
}

module.exports = {
    sortList
};