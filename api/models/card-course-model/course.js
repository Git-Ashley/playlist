const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const JLPT1_VOCAB_COURSE_ID = '60158699f2dbe52d48c28711';
const JLPT2_VOCAB_COURSE_ID = '600203a5a39a74def6527f7c';

const CourseSchema = new Schema({
  title: { type: String, required: true },
  tags: { type: [String], default: [] },
});

module.exports = Mem = mongoose.model('course', CourseSchema);
module.exports.getCourseIdForJLPT = jlptLevel => {
  if (jlptLevel === 1)
    return JLPT1_VOCAB_COURSE_ID;
  else if (jlptLevel === 2)
    return JLPT2_VOCAB_COURSE_ID;
};
