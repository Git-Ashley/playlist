const express = require('express');
const passport = require('passport');

const router = express.Router();

router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findOne({_id: id}).then(user => {
    done(null, user);
  })
  .catch(done);
});

module.exports = router;