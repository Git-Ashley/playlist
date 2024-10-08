const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const moment = require('moment');
const mongoose = require('mongoose');
const superagent = require('superagent');

const Card = require('./models/card-course-model/card');
const User = require('./models/card-course-model/user');
const UserCardStats = require('./models/card-course-model/user-card-stats');
const Mem = require('./models/card-course-model/mem');
const Course = require('./models/card-course-model/course');

// Other routes
const authInit = require('./routes/auth/init');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const courseRoutes = require('./routes/course');

const COURSE_ID = '5ebc9e10f8144bff47de9cc8';

const userCardProjectionExclude = {
  'card_id': 0,
  'user_id': 0,
  'course_id': 0,
  '__v': 0
};

const limitAndFormatStatsWithCards = () => [
  {
    '$replaceRoot': {
      'newRoot': {
        '$mergeObjects': [// The order of this array is important - do not change
          '$$ROOT', {
            '$arrayElemAt': [
              '$card', 0
            ]
          }
        ]
      }
    }
  }, {
    '$project': {
      'card': 0,
      ...userCardProjectionExclude
    }
  }
];

const getStatsWithCards = (query, sort) => {
  const statsQuery = {};
  UserCardStats.attrs.forEach(key => {
    if (query[key] !== undefined) {
      statsQuery[key] = query[key];
    }
  });

  const cardQuery = {};
  Card.attrs.forEach(key => {
    if (query[key] !== undefined) {
      cardQuery[`card.0.${key}`] = query[key];
    }
  });

  return UserCardStats.aggregate([
    {
      '$match': statsQuery
    }, {
      '$sort': sort,
    }, {
      '$lookup': {
        'from': 'cards',
        'localField': 'card_id',
        'foreignField': '_id',
        'as': 'card'
      }
    }, { // Possibly more performant sticking this in $lookup.pipeline like in getCardsWithStats?
      '$match': cardQuery
    }, {
      '$facet': {
        count:  [{ '$count': "count" }],
        data: limitAndFormatStatsWithCards()
      }
    },
  ]);
};

const getSliceAndFormatCardsWithStats = () => [
  {
    '$project': {
      'user_stats': 0,
      ...userCardProjectionExclude
    }
  },
];

const getCardsWithStats = (query, sort) => {
  const sortField = Object.keys(sort)[0];

  const statsQuery = {};
  UserCardStats.attrs.forEach(key => {
    if (query[key] !== undefined) {
      statsQuery[key] = query[key];
    }
  });
  delete statsQuery.user_id;
  delete statsQuery.course_id;

  const cardQuery = {};
  Card.attrs.forEach(key => {
    if (query[key] !== undefined) {
      cardQuery[key] = query[key];
    }
  });

  return Card.aggregate([
    {
      '$match': cardQuery
    }, {
      '$project': {
        ...Card.attrs.reduce((accum, key) => {
          accum[key] = 1;
          return accum;
        }, {}),
        [sortField]: { $ifNull: [ `$${sortField}`, 99999 ] },
      }
    },
    {
      '$sort': sort,
    }, {
      '$lookup': {
        'from': 'usercardstats',
        'let': {
          'cardid': '$_id'
        },
        'pipeline': [
          {
            '$match': {
              '$expr': {
                '$eq': [
                  '$card_id', '$$cardid'
                ]
              },
              user_id: query.user_id
            }
          }
        ],
        'as': 'user_stats'
      }
    }, {
      '$replaceRoot': {
        'newRoot': {
          '$mergeObjects': [
            {
              '$arrayElemAt': [
                '$user_stats', 0
              ]
            }, '$$ROOT'
          ]
        }
      }
    }, {
      '$match': statsQuery
    }, {
      '$facet': {
        count:  [{ '$count': "count" }],
        data: getSliceAndFormatCardsWithStats()
      }
    },
  ]);
};

const getCards = (query, sort = { primary_index: 1 }) => {
  if (UserCardStats.attrs.includes(Object.keys(sort)[0])) {
    return getStatsWithCards(query, sort);
  } else if (Card.attrs.includes(Object.keys(sort)[0])) {
    return getCardsWithStats(query, sort);
  }
};

// Routes
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json({ limit: '1mb' }));
router.use(cookieParser());
router.use(authInit);
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/course/:courseId', courseRoutes);

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

  const mem = await Mem.findOne({ _id: memId });
  if (!mem) {
    return res.status(400).json({ msg: 'Mem not found' });
  }

  if (mem.imgUrl) {
    try {
      const res = await superagent
          .post('http://localhost:33404/memage/delete/')
          .send({ imgUrl: mem.imgUrl });
      const msg = res.body.msg;
      await Mem.deleteOne({ _id: memId });
    } catch (err) {
      return res.status(400).json({ msg: err });
    }
  } else {
    await Mem.deleteOne({ _id: memId });
  }

  const updatedCard = await Card.findOneAndUpdate(
    { _id: cardId },
    { $pull: { mems: memId } },
    { new: true },
  );

  return res.json(updatedCard.mems);
});

router.post('/mem/add', async (req, res) => {
  const memText = req.body.text;
  const imgData = req.body.imgData;
  const user = req.user;
  const author = user.username;
  const cardId = req.body.cardId;

  let newMem;

  if (imgData) {
    try {
      const res = await superagent
        .put('http://localhost:33404/memage/')
        .send({ ...imgData });
      const url = res.body.url;
      newMem = await Mem.create({
        imgUrl: url,
        author,
      });
    } catch (err) {
      console.error(err);
    }
  } else if (memText) {
    newMem = await Mem.create({
      text: memText,
      author,
    });
  }

  if (newMem) {
    const updatedCard = await Card.findOneAndUpdate(
        {_id: cardId},
        {$push: {mems: newMem.id}},
        {new: true},
    );

    res.json(updatedCard.mems);
  } else {
    res.status(400);
    res.send('Error :(');
  }
});

/**
 * Tag routes
 */
router.post('/course/:courseId/tag/create', async (req, res) => {
  const user = req.user;
  const courseId = req.params.pcourseId;
  const newTag = req.body.tag;

  if (!courseId) {
    return res.status(400).json();
  }

  if (!user.courses[courseId]) {
    user.courses[courseId] = {};
  }

  const tags = user.courses[courseId].tags;
  if (!Array.isArray(tags)) {
    user.courses[courseId].tags = [newTag];
  } else if (!tags.includes(newTag)) {
    tags.push(newTag);
  } else {
    return res.status(400).json({ msg: 'tag already exists' });
  }

  user.markModified('courses');
  const updatedUser = await user.save();

  res.json(updatedUser);
});

router.post('/course/:courseId/course-tag/create', async (req, res) => {
  const courseId = req.params.courseId;
  const newTag = req.body.tag;

  if (!newTag) {
    return res.status(400).json({ error: 'No tag given' });
  }

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID not found' });
  }

  const updatedCourse = await Course.findOneAndUpdate(
    { _id: courseId },
    { $addToSet: { tags: newTag } },
    { new: true },
  );

  if (!updatedCourse) {
    return res.status(400).json();
  }

  return res.json(updatedCourse);
});

/**
 * Card routes
 */
router.post('/cards/search', async (req, res) => {
  const userId = req.user.id;

  const {
    excludeUserTags = [],
    excludeCourseTags = [],
    includeUserTags = [],
    includeCourseTags = [],
    sortField = 'primary_index',
    sortMode = 1,
    reviewDateMode,
    courseId,
    ...rest
  } = req.body;

  const sort = { [sortField]: sortMode };

  /**
   * For queries that involve both CARD and STATS, see https://docs.mongodb.com/manual/reference/database-references/
   */
  const query = {
    user_id: mongoose.Types.ObjectId(userId),
    course_id: courseId ? mongoose.Types.ObjectId(courseId) : undefined,
    tags: { $nin: excludeUserTags },
    course_tags: { $nin: excludeCourseTags },
    ...rest
  };

  if (includeUserTags.length) {
    query.tags.$all = includeUserTags;
  }

  if (includeCourseTags.length) {
    query.course_tags.$all = includeCourseTags;
  }

  if (reviewDateMode === 'BEFORE') {
    query.review_date = { $lte: new Date() };
  } else if (reviewDateMode === 'AFTER') {
    query.review_date = { $gte: new Date() };
  } else if (reviewDateMode === 'LEARNT') {
    query.review_date = { $exists: true }
  } else if (reviewDateMode === 'UNLEARNT') { // i.e. unlearnt
    query.review_date = null;
  }

  const userCards = await getCards(query, sort);
  const data = userCards[0].data;
  const count = userCards[0].count[0] && userCards[0].count[0].count;

  // Temporary, until the stupid review_date/level system is changed.
  data.forEach(userCard => {
    userCard.level = Math.floor(userCard.level/req.user.default_levels.length);
  });

  res.json({
    data,
    count,
  });
});

router.post('/card/create', async (req, res) => {
  const data = req.body;

  try {
    const newCard = await Card.create(
      data,
      /*{
        upsert: true,
        new: true,
        projection: {
          ...userCardProjectionExclude,
        }
      }*/
    );
    return res.json({ msg: 'Card created!' });
  } catch (e) {
    console.log('error:', e);
    return res.status(400).json({ msg: e });
  }
});

router.get('/course/:courseId', async (req, res) => {
  const courseId = req.params.courseId;

  const course = await Course.findOne(
      { _id: mongoose.Types.ObjectId(courseId) },
      { __v: 0 },
  );
  res.json(course);
});
router.post('/course/create', async (req, res) => {
  const title = req.body.title;
  if (typeof title !== 'string' || !title) {
    return res.status(400).json({ msg: 'Mem not found' });
  }

  const course = await Course.findOneAndUpdate(
    { title }, { title }, { new: true, upsert: true }
  );

  res.json(course);
});
router.get('/courses', async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

const combineCardAndStats = (card, stats = { _doc: {} }, user) => {
  const userCard = { ...stats._doc, ...card._doc };
  Object.keys(userCardProjectionExclude).forEach(field => {
    delete userCard[field];
  });

  userCard.level = Math.floor(userCard.level/user.default_levels.length);

  return userCard;
};

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

    const card = await Card.findOne({ _id: userCardInfo.card_id });

    const userCard = combineCardAndStats(card, userCardInfo, req.user);

    res.json(userCard);
  }

  return res.json({ error: 'Oops! Something went wrong! Please contact support at support@/dev/null'});
});

// Update user specific stuff
router.post('/card/:cardId/update', async (req, res) => {
  //TODO if (level !== 0) { calculate review_date }
  const userId = req.user.id;
  const cardId = req.params.cardId;

  const updates = {};
  const tags = req.body.tags;
  const level = req.body.level;

  if (Array.isArray(tags)) {
    // Remove dupes
    updates.tags = [...new Set(tags).values()];
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
      upsert: true,
    }
  );

  const card = await Card.findOne({ _id: userCardInfo.card_id });

  const userCard = combineCardAndStats(card, userCardInfo, req.user);

  res.json(userCard);
});

router.post('/card/:cardId/unlearn', async (req, res) => {
  const userId = req.user.id;
  const cardId = req.params.cardId;

  const userCardInfo = await UserCardStats.findOneAndUpdate(
    {
      user_id: userId,
      card_id: cardId,
    },
    {
      $unset: { level: "", review_date: "" },
    },
    {
      new: true,
      upsert: true,
      projection: {
        ...userCardProjectionExclude,
        _id: 0,
      }
    }
  );

  res.json(userCardInfo);
});

router.post('/card/:cardId/blueprint', async (req, res) => {
  const userId = req.user.id;
  const cardId = req.params.cardId;

  const updates = {};
  const newDef = req.body.definition;
  const courseTags = req.body.course_tags;

  if (newDef) {
    updates.definition = newDef;
  } else if (Array.isArray(courseTags)) {
    updates.course_tags = [...new Set(courseTags).values()];
  }

  const updatedCard = await Card.findOneAndUpdate(
    { _id: cardId },
    updates,
    { new: true },
  );

  const userStats = await UserCardStats.findOne({
    user_id: userId,
    card_id: cardId,
  });

  const userCard = combineCardAndStats(updatedCard, userStats, req.user);

  res.json(userCard);
});

module.exports = router;
