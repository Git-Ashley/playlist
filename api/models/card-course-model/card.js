const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attrs = {
  value: { type: String, required: true },
  definition: [String],
  mems: [Schema.Types.ObjectId],
  primary_index: { type: Schema.Types.Mixed, required: true },
  examples: [{
    example: String,
    answer: String
  }],
  secondary_index: Schema.Types.Mixed,
  tertiary_index: Schema.Types.Mixed,
  attributes: [{
    key: { type: String, required: true },
    value: { type: String, required: true },
    value_type: { type: String, default: 'string' },//audio|image|string
    showWithValue: { type: Schema.Types.Bool, default: false }
  }],//NOT ABLE TO INDEX.
  course_id: { type: Schema.Types.ObjectId, required: true },
  course_tags: [String]
};

const CardSchema = new Schema(attrs);

CardSchema.index({ course_id: 1, primary_index: 1 });
CardSchema.index(
  { course_id: 1, secondary_index: 1 },
  { partialFilterExpression: { secondary_index: { $exists: true } } },
);
CardSchema.index(
  { course_id: 1, tertiary_index: 1 },
  { partialFilterExpression: { tertiary_index: { $exists: true } } },
);
CardSchema.index(
  { course_id: 1, course_tags: 1 },
  { partialFilterExpression: { course_tags: { $exists: true } } },
);

module.exports = Card = mongoose.model('card', CardSchema);
module.exports.attrs = Object.keys(attrs);
