const express = require('express');
const Course = require('../models/card-course-model/course');
const Card = require('../models/card-course-model/card');
const UserCardStats = require('../models/card-course-model/user-card-stats');
const mongoose = require('mongoose');
const { combineCardAndStats } = require('../user-card-utils');

const router = express.Router();

router.get('/kanji/:kanji', async (req, res) => {
  const userId = req.user.id;
  const kanji = req.params.kanji;
  const vocabN2CourseId = Course.getCourseIdForJLPT(2);
  const vocabN1CourseId = Course.getCourseIdForJLPT(1);

  const n2Cards = await Card.find({
    course_id: mongoose.Types.ObjectId(vocabN2CourseId),
    value: { $regex: kanji }
  });

  const n1Cards = await Card.find({
    course_id: mongoose.Types.ObjectId(vocabN1CourseId),
    value: { $regex: kanji }
  });

  let unlearntCount = 0;
  let learntCount = 0;
  const n2UserCards = await Promise.all(n2Cards.map(async (card) => {
    const userStats = await UserCardStats.findOne({ card_id: card._id });
    if (userStats && (userStats.review_date || userStats.tags.includes('ignore'))) {
      ++learntCount;
    } else {
      ++unlearntCount;
    }
    return combineCardAndStats(card, userStats, req.user);
  }))

  const n1UserCards = await Promise.all(n1Cards.map(async (card) => {
    const userStats = await UserCardStats.findOne({ card_id: card._id });
    return combineCardAndStats(card, userStats, req.user);
  }))

  const stats = {
    unlearnt: unlearntCount,
    learnt: learntCount,
    n2Cards: n2UserCards,
    n1Cards: n1UserCards
  }

  res.json(stats);
});

router.get('/kanji/:vocab', async (req, res) => {
  res.json({ msg: 'Endpoint not yet implemented' });
})

module.exports = router;
