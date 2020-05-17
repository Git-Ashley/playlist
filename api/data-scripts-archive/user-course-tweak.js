const Course = require('./models/card-course-model/course');
const linkCourse = async() => {

  const user = await User.findOne({ username: 'rooster356'});
  console.log('userL', JSON.stringify(user));

  const course = await Course.findOne({ title: 'Kanji 2500'});
  console.log('course:', JSON.stringify(course));

  user.courses = {
    [course._id]: {
      tags: [], // list of user defined tags for this course and user
      join_date: new Date()
    }
  };

  const newUser = await user.save();
  console.log('newUser:', newUser);
};

linkCourse();