const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  usernmae: { type: String, required: true },
  courses: [Schema.Types.ObjectId]
});



module.exports = User = mongoose.model('user', UserSchema);
