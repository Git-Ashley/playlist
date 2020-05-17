const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemSchema = new Schema({
  text: String,
  author: { type: String, required: true }
});

module.exports = Mem = mongoose.model('mem', MemSchema);
