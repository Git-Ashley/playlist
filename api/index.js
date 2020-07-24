const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
//const helmet = require('helmet');
const MongoStore = require('connect-mongo')(session);
const api = require('./api');

const mongoUrl = 'mongodb://localhost:27017/docker-node-mongo';
const PORT = 4435;

mongoose
    .connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(console.log);

const app = express();

/*
app.use(helmet({
  ieNoOpen: false,
  dnsPrefetchControl: false
}));
 */

const sessionMiddleware = session({
    secret: 'dogjdsoijqE4rt89q3ur4rt£W$T*IQfiaf83q489rth8y',
    //secure: true,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({ url: mongoUrl })
});

app.use(sessionMiddleware);

app.use('/api', api);

app.listen(PORT, (err) => {
    if(err){
        console.error(err);
        process.exit(1);
    } else {
        console.log(`Listening on port: ${PORT} (http)`);
        if(process.env.NODE_ENV !== "production")
            console.log("Running in development mode");
        else
            console.log("Running in production mode");
    }
});