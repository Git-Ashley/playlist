const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express')

const Card = require('./models/card-course-model/card');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

// Routes example
//app.use('/auth', require(API_ROOT + '/routes/auth/auth.js')());

router.get('/cards', (req, res) => Card.find()
    .then(cards => res.json({ cards }))
    .catch(err => res.status(404).json({ msg: 'No cards found' }))
);

router.post('/item/add', (req, res) => {
    const newItem = new Card({
        name: req.body.name,
        value: req.body.value
    });

    newItem.save().then(item => res.json({ item }));
});

router.post('/upload', (req, res) => {
  // start le upload process
  const kanjiList = JSON.parse(fs.readFileSync(`./kanji-sample.json`, 'utf8'));


});

module.exports = router;


/**
 *   passport.deserializeUser(function(id, done) {
    User.
      findOne({ _id : id }).
      exec(done);
  });
 */


/**
 *router.post('/unlink/:site', function(req, res){
    const site = req.params.site;
    const user = req.user;
 */