const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

module.exports = function(app, server) {

    // Essentials/setup
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cookieParser());

    // Routes example
    //app.use('/auth', require(API_ROOT + '/routes/auth/auth.js')());

    app.use('/test', (/*TODO*/) => {
        //TODO
    })

};