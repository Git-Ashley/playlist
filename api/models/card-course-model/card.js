const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CardSchema = new Schema({
  value: { type: String, required: true },
  definition: String,
  mems: [Schema.Types.ObjectId],
  primaryAttribute: Schema.Types.Mixed,// the default index
  secondaryAttribute: Schema.Types.Mixed,
  tertiaryAttribute: Schema.Types.Mixed,
  otherAttributes: [{
    key: { type: String, required: true },
    value: { type: String, required: true },
    showWithValue: { type: Schema.Types.Bool, default: false }
  }],//NOT ABLE TO INDEX.
  course_id: { type: Schema.Types.ObjectId, required: true },
  course_tags: [String]
});

CardSchema.index({ primaryAttribute: 1 });
CardSchema.index({ secondaryAttribute: 1 });
CardSchema.index({ tertiaryAttribute: 1 });
CardSchema.index({ course_tags: 1 }, { sparse: true });

module.exports = Card = mongoose.model('card', CardSchema);
