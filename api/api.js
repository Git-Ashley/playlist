const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');

const Card = require('./models/card-course-model/card');
const User = require('./models/card-course-model/user');
const UserCardStats = require('./models/card-course-model/user-card-stats');

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

// Routes example
//app.use('/auth', require(API_ROOT + '/routes/auth/auth.js')());

//TODO /cards/search add params: courseId, userId, tags, sort order
router.get('/cards', (req, res) => {
  Card.find()
    .then(cards => res.json(cards))
    .catch(err => res.status(404).json({ msg: 'No cards found' }))
  }
);

router.post('/login', (req, res) => {
  User.findOne({ username : req.body.username }).then(user => res.json(user));
});

//router.post('/course/:courseId')
router.post('/card/:cardId/update', async (req, res) => {
  //TODO if (level !== 0) { calculate review_date }
  const userId = req.user.id;
  const cardId = req.params.cardId;

  const updates = {};
  const tags = req.body.tags;
  const level = req.body.tags;

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
  res.json({ userId, cardId });
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