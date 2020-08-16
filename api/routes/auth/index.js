const passport = require('passport');
const express = require('express');
const User = require('../../models/card-course-model/user');
const LocalStrategy = require('passport-local').Strategy;

const router = express.Router();

passport.use(new LocalStrategy((username, password, done) => {
    User.findOne({ username }).then(user => {

        if (!user) {
            return done(null, false);
        }

        return Promise.all([
          user,
          user.passwordMatch(password)
        ]);
    })
    .then(([user, passwordMatches]) => {
      //TODO
      if (!passwordMatches) {
        //return done(null, false);
      }

      done(null, user);
    })
    .catch(done);
}));

router.post(
    '/local',
    function(req, res, next){
        //if(!req.body.password)
            //return res.json({"errors": ["Password must be supplied"]});
        if(!req.body.username)
            return res.json({"errors": ["Username must be supplied"]});

        passport.authenticate('local', function(err, user, info) {
            if (err) { return next(err); }

            if (!user)
                return res.json({"errors": [info.msg]});

            req.logIn(user, function(err) {
                if (err)
                    return next(err);

                return res.json(user);
            });
        })(req, res, next);
    }
);

router.post('/logout', function(req, res){
    req.logout();
    res.json({});
});

module.exports = router;
