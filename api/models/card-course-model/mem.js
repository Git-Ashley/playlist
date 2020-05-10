const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemSchema = new Schema({
  text: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true }
});

module.exports = Mem = mongoose.model('mem', MemSchema);
