const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserCardStatsSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, required: true },
  card_id: { type: Schema.Types.ObjectId, required: true },
  selectedMem: { type: Schema.Types.ObjectId },
  level: { type: Number, default: 0 },
  tags: [String]
});

UserCardStatsSchema.index({ level: 1 });
UserCardStatsSchema.index({ tags: 1 }, { sparse: true });

module.exports = Mem = mongoose.model('userCardStats', UserCardStatsSchema);


// TODO Ability to pass a modifier to the time (separate from the lvl; it will simply affect the cooldown directly)

//User.find()
//   .where('fb.id')
//   .in([3225, 623423, 6645345])
//   .exec(function (err, records) {
//     //make magic happen
//   });

/**
 * PLAN:
 * Step 1: Grab all ID's for the specific tag you are looking for (or learnt)
 * Step 2: Gather all the card_id's, and use the above query, with sort({ primary - tertiary }) and limit()
 */