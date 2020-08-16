const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  password: String,
  courses: Object,
  default_levels: {
    type: Array,
    default: [
      {
        denomination: 'minute',
        value: 10,
      },
      {
        denomination: 'hour',
        value: 1,
      },
      {
        denomination: 'hour',
        value: 4,
      },
      {
        denomination: 'day',
        value: 1,
      },
      {
        denomination: 'day',
        value: 3,
      },
      {
        denomination: 'day',
        value: 7,
      },
      {
        denomination: 'day',
        value: 15,
      },
      {
        denomination: 'day',
        value: 30,
      },
      {
        denomination: 'day',
        value: 60,
      },
      {
        denomination: 'day',
        value: 120,
      }
    ]
  }
});

UserSchema.methods.getId = function(){
  return this._id.toString();
};

UserSchema.methods.passwordMatch = async plainText => {
  if (!this.password || plainText) {
    return false;
  }
  return await bcrypt.compare(plainText, this.password);
};

module.exports = User = mongoose.model('user', UserSchema);

/*
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
 */