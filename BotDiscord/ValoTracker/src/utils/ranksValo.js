const rankOrder = [
    'iron 1', 'iron 2', 'iron 3',
    'bronze 1', 'bronze 2', 'bronze 3',
    'silver 1', 'silver 2', 'silver 3',
    'gold 1', 'gold 2', 'gold 3',
    'platinum 1', 'platinum 2', 'platinum 3',
    'diamond 1', 'diamond 2', 'diamond 3',
    'ascendant 1', 'ascendant 2', 'ascendant 3',
    'immortal 1', 'immortal 2', 'immortal 3',
    'radiant'
  ];
  
const rankIndex = rank => rankOrder.indexOf(rank);
  
module.exports = { rankOrder, rankIndex };
