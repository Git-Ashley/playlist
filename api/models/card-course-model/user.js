const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
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
        value: 6,
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
        value: 20,
      },
      {
        denomination: 'day',
        value: 50,
      },
      {
        denomination: 'day',
        value: 100,
      },
      {
        denomination: 'day',
        value: 180,
      }
    ]
  }
});



module.exports = User = mongoose.model('user', UserSchema);
