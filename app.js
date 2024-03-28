if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

console.log(process.env.SECRET)

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
// const Joi = require('joi'); //don't need Joi here anymore because we are exporting our schema file which depends on Joi
//destructing becuase there will be multiple schemas in the future
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//When you send a post request and res.send('req.body') to see if it works...
//if you get an empty page it's because the request body hasn't been parsed yet
app.use(express.urlencoded({ extended: true }));
//the response comes back under campground
//so you need to take req.body.campground to create a new campground
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

//you want the cookie to expire so that if someone logs in once they have to eventually log in again
const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); //to make sure you don't have to login everytime, make sure this is not above session
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); //how to store in a session
passport.deserializeUser(User.deserializeUser()); //how to unstore in a session

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user; //now in all of your templates you have access to currentUser
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'abie@gmail.com', username: 'abie' });
//     const newUser = await User.register(user, 'chicken'); //provide a user object and a password
//     res.send(newUser);
// })

app.get('/', (req, res) => {
    res.render('home')
});

//.all is for every single request
//* is for every single path
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

//this handles errors on the client side, user sees this on the form itself
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err }) //by passing {err} I'm able to access err in the error ejs
    //which is ejs err.message
});

app.listen(3000, () => {
    console.log('Serving on port 3000')
})
