const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  title: { type: String, required: true },
  tags: { type: [String], default: [] },
});

module.exports = Mem = mongoose.model('course', CourseSchema);
