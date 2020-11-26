const bcrypt = require('bcrypt');
const express = require('express');
const User = require('../models/card-course-model/user');
const UserCardStats = require('../models/card-course-model/user-card-stats');
const Card = require('../models/card-course-model/card');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

let i = 1;

const mockUserCardStats = async (primaryIndex, userId) => {
  // Grab the card IDs corresponding to the primary
  const card = await Card.findOne({ primary_index: primaryIndex });

  // Create a corresponding UserCardStats object
  await UserCardStats.create({
    user_id: userId,
    card_id: card._id,
    course_id: card.course_id,
    review_date: new Date().toISOString(),
    level: 1,
  });
}

router.post('/guestlogin', async (req, res) => {
  const guest = await User.create({
    username: `Guest${i++}`,
    courses: {
      "5ebc9e10f8144bff47de9cc8": {
        "tags": ["difficult", "test tag"],
        "join_date": new Date().toISOString(),
      }
    },
  });

  const userId = guest.id;

  const randomNumbers = [];
  for (i=0; randomNumbers.length<20; i++) {
    const rand = Math.ceil(Math.random()*100);
    if (!randomNumbers.includes(rand)) {
      randomNumbers.push(rand);
    }
  }

  randomNumbers.forEach(rand => mockUserCardStats(rand, userId));

  // Log guest in
  req.logIn(guest, function(err) {
      if (err)
          return next(err);

      return res.json(guest);
  });

});

router.post('/setpasswd', async (req, res) => {
  const user = req.user;
  const newPass = req.body.newPassword;

  await user.setPassword(newPass);

  console.log('user:', JSON.stringify(user));
  await user.save();

  res.json(user);
});

module.exports = router;
