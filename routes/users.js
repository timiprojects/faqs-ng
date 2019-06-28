const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const {
    ensureAuthenticated
} = require('../config/auth')
const nodemailer = require('nodemailer')
const uploads = require('../config/uploadMidWare')
const Resize = require('../config/resize')
const path = require('path')
const fs = require('fs')

//load user model
const User = require('../models/user')

//REGISTER PAGE
router.get('/auth', (req, res) => {
    if (req.user) {
        return res.redirect('/v2/project')
    } else {
        res.render('login')
    }
})

router.get('/register', (req, res)=>{
    if (req.user) {
        return res.redirect('/v2/project')
    } else {
        res.render('register')
    }
})

//REGISTER NEW USER
router.post('/register', uploads.single('avatar'), async (req, res) => {
    // const imagePath = path.join(__dirname, '/public/images')
    // const fileUpload = new Resize(imagePath)
    var imagepath, image_encode, contentType, avatar = ""
    var fileStream = {}
    if (!req.file) {
        fileStream = {
            data: "",
            contentType: "",
        }
    } else {
        imagepath = fs.readFileSync(req.file.path)
        image_encode = imagepath.toString('base64')
        contentType = req.file.mimetype
        avatar = new Buffer(image_encode, 'base64')
        avatar = image_encode
        fileStream = {
            data: avatar,
            contentType: contentType
        }
    }
    const {
        email,
        name,
        password,
        cpassword
    } = req.body
    let errors = []

    if (!email || !name || !password || !cpassword) {
        errors.push({
            msg: 'Please enter all fields'
        })
    }

    if (password != cpassword) {
        errors.push({
            msg: 'Passwords do not match'
        });
        req.flash('error_msg', 'Passwords do not match!')
    }

    // if (upassword.length < 6) {
    //     errors.push({
    //         msg: 'Password must be at least 6 characters'
    //     });
    // }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            email,
            name,
            password,
            cpassword
        });
    } else {
        User.findOne({
            email: uemail
        }).then(user => {
            if (user) {
                req.flash('error_msg', 'Email already exists!')
                res.render('register', {
                    email,
                    name,
                    password,
                    cpassword
                });
            } else {
                // const filename = await fileUpload.save(req.file.buffer)
                const newUser = new User({
                    email,
                    name,
                    password,
                    avatar: fileStream,
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'error_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/auth');
                            })
                            .catch(err => {
                                req.flash(
                                    'error_msg',
                                    'User registration failed'
                                )
                            });
                    });
                });
            }
        })
    }
})

//USER LOGIN
router.post('/auth', (req, res, next) => {
    // passport.authenticate('local', {
    //     successRedirect: '/v2/project',
    //     failureRedirect: '/users/auth',
    //     failureFlash: 'res.statusMessage',

    // })(req, res, next)
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            req.flash('error_msg', 'User does not exist!')
            res.redirect(req.originalUrl);
        }
        req.logIn(user, function (err) {
            if (err) {

                return next(err);
            }
            return res.redirect('/v2/project')
        });
    })(req, res, next);
})

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('error_msg', 'You are logged out');
    res.redirect('/users/auth');
});

//get user details
router.get('/:usr/myaccount', ensureAuthenticated, (req, res) => {
    var user = req.user
    if (req.params.usr != 'undefined' && user) {
        if (user._id == req.params.usr) {
            res.render('space/myaccount', {
                user,
                title: 'myaccount'
            });
        }
    }
})

//account update
router.post('/:usr/myaccount', uploads.single('avatar'), ensureAuthenticated, (req, res) => {
    var imagepath, image_encode, contentType, avatar = ""
    var fileStream = {}

    const {
        email,
        name,
        mobile
    } = req.body

    const updates = {
        email,
        name,
        mobile
    }

    if(req.file) {
        imagepath = fs.readFileSync(req.file.path)
        image_encode = imagepath.toString('base64')
        contentType = req.file.mimetype
        avatar = new Buffer(image_encode, 'base64')
        
        updates.avatar.data = avatar
        updates.avatar.contentType = contentType
    }
    let errors = []
    if (!email || !name) {
        errors.push({
            msg: 'Please enter all fields'
        })
    }
    if (errors.length == 0) {
        User.findOneAndUpdate({
            _id: req.user._id
        }, {
            $set: updates
        }, {
            upsert: true,
            new: true,

        }, (err, user) => {
            if (err) {
                req.flash('error_msg', 'Cannot update user account')
                res.redirect(req.originalUrl);
            }

            req.flash('error_msg', 'User account updated!!')
            res.redirect(req.originalUrl);

        })
    }
})

//user image 
router.get('/photo', ensureAuthenticated, (req, res) => {
    res.contentType(req.user.avatar.contentType)
    res.send(req.user.avatar.data)
})

module.exports = router