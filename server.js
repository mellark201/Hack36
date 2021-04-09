const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const GithubStrategy = require('passport-github');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

const User = require('./models/user');

app.use(flash());


//Important for Passport.js
app.use(require('express-session')({
    secret:'codecode',
    resave:false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new GithubStrategy({
    clientID : "aa3269056a6f67fc8129",
    clientSecret: "f7c8f9e1be99ea02e2e612dc70f7955cafd7bc34",
    callbackURL: "http://localhost:3000/github/callback"
    },
    function(accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({username: profile.username}, {
            email: profile._json.email ? profile._json.email : profile.username,
            githubAvatar: profile._json.avatar_url,
            name: profile.displayName ? profile.displayName : profile.username,
            bio: profile._json.bio ? profile._json.bio : profile.username,
            twitter: profile.username,
            linkedIn: profile.username,
            other: profile.username,
            profileUrl: profile.profileUrl
        }, function(err, user) {
            console.log(user);
            return cb(err, user);
        })
    }
))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
})


app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(express.static('public'));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({limit: '10mb', extended:false}));

const mongourl = "mongodb+srv://mellark201:mellark201@codecollab.zucli.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

const mongoose = require('mongoose');
mongoose.connect(mongourl, {useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true});
const db = mongoose.connection
db.on('error', error => console.log(error));
db.once('open', () => {
    console.log('Connected to Mongoose');
})


const indexRouter = require('./routes/index');
const githubRouter = require('./routes/github');
const proposalRouter = require('./routes/proposal');
const profileRouter = require('./routes/profile');
const registerRouter = require('./routes/register');
const signupRouter = require('./routes/signup');
const checkRouter = require('./routes/check');

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use('/', indexRouter);
app.use('/github', githubRouter);
app.use('/proposal', proposalRouter);
app.use('/profile', profileRouter);
app.use('/signup', signupRouter);
app.use('/check', checkRouter);
app.use('/register', registerRouter);
app.set('socketio', io);
require('./socket')(io);

server.listen(process.env.PORT || 3000);