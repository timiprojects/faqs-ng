const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport');
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')


const app = express()

const http = require('http').createServer(app)

// Passport Config
require('./config/passport')(passport);

// DB Config
const db = require('./config/keys').mongoURI;

// Connect to MongoDB
mongoose
    .connect(
        db, {
            useNewUrlParser: true,
            useCreateIndex: true
        }
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

//EXPRESS BODY PARSER
// app.use(express.urlencoded({
//     extended: false
// }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

app.use(cors())
//EJS VIEW ENGINE
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.use(express.static(path.join(__dirname,'/public')))

app.use(cookieParser())

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


//catch error 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
}) 

// Error handler
app.use(function (err, req, res, next) {
    res.locals.error = err
    res.locals.message = err.message

    //render error page
    res.status(err.status || 500);
    res.render('error')
})

const PORT = process.env.PORT || 3000

http.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});