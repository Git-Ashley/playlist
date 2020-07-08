const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const moment = require('moment');

const Card = require('./models/card-course-model/card');
const User = require('./models/card-course-model/user');
const UserCardStats = require('./models/card-course-model/user-card-stats');
const Mem = require('./models/card-course-model/mem');

const COURSE_ID = '5ebc9e10f8144bff47de9cc8';

// Utils
const getUserFormattedCard = (defaultLevels, card, cardStats = {}) => {
  const userCard = Card.attrs.reduce((accum, attr) => {
    accum[attr] = card[attr];
    return accum;
  }, {});

  UserCardStats.attrs.forEach((attr) => {
    if (['level'].includes(attr)) {
      const level = Math.floor(cardStats[attr]/defaultLevels.length);
      userCard[attr] = level;
      return;
    }
    userCard[attr] = cardStats[attr];
  });

  userCard.id = card.id;
  delete userCard.course_id;
  delete userCard.user_id;
  delete userCard.card_id;

  return userCard;
};

const combineStatsWithCards = async (userCardStats, defaultLevels) => {
  // use outer joins @ later date
  const cardIds = userCardStats.map(item => item.card_id);

  const cards = await Card.where('_id').in(cardIds);
  // Could create id -> card map, but it will be less efficient for small number of userCardStats.

  return userCardStats.map(stats => {
    const card = cards.find(card => card._id.toString() === stats.card_id.toString());
    return getUserFormattedCard(defaultLevels, card, stats);
  });
};

// Routes
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());
router.use((req, res, next) => {
  User.findOne({ username : 'rooster356' }).then(user => {
    req.user = user;
    next();
  });
});
router.use((req, res, next) => {
  req.courseId = COURSE_ID;
  next();
});

/**
 * Mem routes
 */
router.post('/mems', async (req, res) => {
  if (!req.user || !Array.isArray(req.body)) {
    return res.json({msg: 'Permission denied'});
  }

  const mems = await Mem.where('_id').in(req.body);
  res.json(mems);
});

router.post('/mem/delete', async (req, res) => {
  const memId = req.body.memId;
  const cardId = req.body.cardId;

  await Mem.deleteOne({ _id: memId });

  const updatedCard = await Card.findOneAndUpdate(
    { _id: cardId },
    { $pull: { mems: memId } },
    { new: true },
  );

  res.json(updatedCard.mems);
});

router.post('/mem/add', async (req, res) => {
  const memText = req.body.text;
  const user = req.user;
  const author = user.username;
  const cardId = req.body.cardId;

  const newMem = await Mem.create({
    text: memText,
    author,
  });

  const updatedCard = await Card.findOneAndUpdate(
    { _id: cardId },
    { $push: { mems: newMem.id } },
    { new: true },
  );


  res.json(updatedCard.mems);
});

/**
 * Card routes
 */
router.post('/cards/search', async (req, res) => {
  const userId = req.user.id;
  const courseId = req.courseId;

  const excludeUserTags = req.body.excludeUserTags;
  const excludeCourseTags = req.body.excludeCourseTags;
  const includeUserTags = req.body.includeUserTags;
  const includeCourseTags = req.body.incudeCourseTags;
  const includeTagsMode = 'UNION';
  const reviewDateMode = 'BEFORE';

  const sortBy = 'review_date';
  const sortMode = 'asc';

  /**
   * For queries that involve both CARD and STATS, see https://docs.mongodb.com/manual/reference/database-references/
   */
  const query = {
    user_id: userId,
  };

  if (reviewDateMode === 'BEFORE') {
    query.review_date = { $lte: new Date() };
  } else if (reviewDateMode === 'AFTER') {
    query.review_date = { $gte: new Date() };
  }

  if (excludeUserTags && excludeUserTags.length) {
    query.tags = { $nin: excludeUserTags };
  }

  console.log('query.tags:', query.tags);

  const userCardStatsList = await UserCardStats.find(query).sort({ [sortBy]: sortMode });

  const userCards = await combineStatsWithCards(userCardStatsList, req.user.default_levels);

  res.json(userCards);
});

router.post('/card/:cardId/review', async (req, res) => {
  const user = req.user;
  const cardId = req.params.cardId;
  const level = req.body.level;
  const { denomination, value } = user.default_levels[level];
  const updates = {};

  const nextReview = moment().add(value, denomination);
  const score = level * user.default_levels.length;

  if (!isNaN(level)) {
    updates.level = score;
    updates.review_date = nextReview;

    const userCardInfo = await UserCardStats.findOneAndUpdate(
      {
        user_id: user.id,
        card_id: cardId,
      },
      updates,
      {
        new: true,
        upsert: true, // Make this update into an upsert
      }
    );

    const newCardInfo = await userCardInfo.save();

    return res.json({
      review_date: newCardInfo.review_date,
    });
  }

  return res.json({ error: 'Opps! Something went wrong! Please contact support at /dev/null@idgaf.co.uk'});
});

//TODO /cards/search add params: courseId, userId, tags, sort order
router.get('/cards-old', async (req, res) => {
  const userId = req.user.id;
  //const cards = await Card.find({ secondary_index: { $exists: true } }).limit(20);
  const cards = await Card.find();
  const cardsMap = cards.reduce((accum, card) => {
    accum[card.id] = card;
    return accum;
  }, {});

  const userCardIds = cards.map(card => ({ user_id: userId, card_id: card.id }));

  const userCardStatsList = await UserCardStats.find({ $or: userCardIds });


  const userCards = [];

  for (const cardStats of userCardStatsList) {
    const card = cardsMap[cardStats.card_id];
    userCards.push(getUserFormattedCard(card, cardStats));
  }

  res.json(userCards);
});

router.post('/login', (req, res) => {
  User.findOne({ username : req.body.username }).then(user => res.json(user));
});

router.post('/card/:cardId/update', async (req, res) => {
  //TODO if (level !== 0) { calculate review_date }
  const userId = req.user.id;
  const cardId = req.params.cardId;

  const updates = {};
  const tags = req.body.tags;
  const level = req.body.level;

  if (Array.isArray(tags)) {
    updates.tags = tags;
  }

  if (level) {
    updates.level = level;
  }

  const userCardInfo = await UserCardStats.findOneAndUpdate(
    {
      user_id: userId,
      card_id: cardId,
    },
    updates,
    {
      new: true,
      upsert: true, // Make this update into an upsert
    }
  );

  const newCardInfo = await userCardInfo.save();

  const userCards = await combineStatsWithCards([newCardInfo], req.user.default_levels);

  res.json(userCards[0]);
});

module.exports = router;


/**
 *   passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });
 */


/**
 *router.post('/unlink/:site', function(req, res){
    const site = req.params.site;
    const user = req.user;
 */