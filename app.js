const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const cors = require('cors')

const app = express()

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.use(cors())
//EJS VIEW ENGINE
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'/public')));

//EXPRESS BODY PARSER
app.use(express.urlencoded({
    extended: false
}))

// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.toast_msg = req.flash('toast_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});