const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express')

const Item = require('./models/Item');
const router = express.Router();

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
router.use(cookieParser());

// Routes example
//app.use('/auth', require(API_ROOT + '/routes/auth/auth.js')());

router.post('/test', (req, res) => {
    res.json({ res: req.body.value });
});

router.get('/items', (req, res) => Item.find()
    .then(items => res.json({ items }))
    .catch(err => res.status(404).json({ msg: 'No items found' }))
);

router.post('/item/add', (req, res) => {
    const newItem = new Item({
        name: req.body.name,
        value: req.body.value
    });

    newItem.save().then(item => res.redirect('/'));
});

module.exports = router;