const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemSchema = new Schema({
  text: String,
  imgUrl: String,
  author: { type: String, required: true },
});

MemSchema.method('toJSON', function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

module.exports = Mem = mongoose.model('mem', MemSchema);
