const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attrs = {
  user_id: { type: Schema.Types.ObjectId, required: true },
  card_id: { type: Schema.Types.ObjectId, required: true },
  selected_mem: { type: Schema.Types.ObjectId },
  level: Number,
  tags: [String],
  review_date: Schema.Types.Date
};

const UserCardStatsSchema = new Schema(attrs);

UserCardStatsSchema.index(
  { user_id: 1, card_id: 1 },
  { unique: true },
);
UserCardStatsSchema.index({ level: 1 }, { sparse: true });
UserCardStatsSchema.index({ tags: 1 }, { sparse: true });
UserCardStatsSchema.index({ review_date: 1 }, { sparse: true });

module.exports = Mem = mongoose.model('userCardStats', UserCardStatsSchema);
module.exports.attrs = Object.keys(attrs);

// TODO Ability to pass a modifier to the time (separate from the lvl; it will simply affect the cooldown directly)

//User.where('_id')
//   .in([3225, 623423, 6645345])
//   .exec(function (err, records) {
//     console.log('err:', err);
//     console.log('records:', records);
//   });

//db.inventory.find( { qty: { $nin: [ 5, 15 ] } } )
/**
 * PLAN:
 * Step 1: Grab all ID's for the specific tag you are looking for (or learnt)
 * Step 2: Gather all the card_id's, and use the above query, with sort({ primary - tertiary }) and limit()
 */

/**
 * INVERSE:
 * step 1: Grab all ID's for the specific tag (that you do NOT want)
 * step 2: Gather all the card_id's, and use the above query to grab all IDs that are NOT contained in the array, with sort and limit.
 * ...... Obviously use the course ID in this query somewhere so that you aren't searching millions of cards. use '.nin'
 */