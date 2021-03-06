const userCardProjectionExclude = {
  'card_id': 0,
  'user_id': 0,
  'course_id': 0,
  '__v': 0
};

const combineCardAndStats = (card, stats, user) => {
  let userCard = {};
  if (stats && stats._doc) {
    userCard = { ...stats._doc };
  }
  if (card && card._doc) {
    userCard = { ...userCard, ... card._doc };
  }

  Object.keys(userCardProjectionExclude).forEach(field => {
    delete userCard[field];
  });

  userCard.level = Math.floor(userCard.level/user.default_levels.length);

  return userCard;
};

module.exports = {
  userCardProjectionExclude,
  combineCardAndStats
}
