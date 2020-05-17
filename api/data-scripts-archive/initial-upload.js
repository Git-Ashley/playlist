const Course = require('./models/card-course-model/course');
const UserCardStats = require('./models/card-course-model/user-card-stats');
const Mem = require('./models/card-course-model/mem');
const fs = require('fs');

const uploadKanji = (userId, courseId) => {
  // start le upload process
  const kanjiList = JSON.parse(fs.readFileSync(`./kanji-mongo.json`, 'utf8'));

  kanjiList.reverse().forEach(kanjiDef => {
    // Process mem tasks before saving the card as the card needs to know about the memIDs!
    const memTasks = [];
    if (Array.isArray(kanjiDef.mems)) {
      kanjiDef.mems.forEach(mem => {
        const memItem = new Mem({...mem});
        memTasks.push(memItem.save());
      });
    }

    Promise.all(memTasks).then(mems => {
      const kanjiCard = new Card({
        primary_index: kanjiDef.freqIndex,
        secondary_index: kanjiDef.kodanshaRef,
        value: kanjiDef.kanji,
        definition: kanjiDef.definition,
        mems: mems.map(mem => mem._id),
        course_id: courseId
      });
      return kanjiCard.save().then(card => ({ card, mems }))
    }).then(({ card, mems }) => {
      // Process user-card-stats items independently.
      if (Array.isArray(kanjiDef.tags)) {
        const item = {};
        kanjiDef.tags.forEach(tag => {
          if (tag === 'unchecked') {
            return;
          }

          if (tag === 'learnt') {
            item.level = 30;
          } else {

            if (item.tags) {
              item.tags.push(tag)
            } else {
              item.tags = [tag];
            }

          }

        });
        item.user_id = userId;
        item.card_id = card._id;
        if (Array.isArray(mems)) {
          const mem = mems.find(mem => mem.author === 'AshleyPhillipscf37');
          if (mem) {
            item.selected_mem = mem._id;
          }
        }

        if (item.level) {
          item.review_date = new Date();
        }

        if (item.level || item.tags || item.selected_mem) {
          const newUserStats = new UserCardStats(item);
          newUserStats.save();
        }

      }
    });
  });
};

const createData = async() => {
  const newUser = new User({
    username: 'rooster356',
    email: 'ashleyp1621@gmail.com'
  });
  const user = await newUser.save();

  const newCourse = new Course({
    title: 'Kanji 2500',
  });
  const course = await newCourse.save();

  uploadKanji(user._id, course._id);
};

createData();