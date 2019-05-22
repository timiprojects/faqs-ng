const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth')
const nodemailer = require('nodemailer')
const uploads = require('../config/uploadMidWare')
const Resize = require('../config/resize')
const path = require('path')
const fs = require('fs')

//load user model
const User = require('../models/user')

//mail transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    
})

let mailOptions = {
    from: '<no-reply@faqs.ng>',
    to: 'tdavidz@gmail.com',
    subject: 'Testing this',
    text: 'This has to work'
}

//REGISTER PAGE
router.get('/auth', (req, res) => res.render('register'))

//REGISTER NEW USER
router.post('/register', uploads.single('avatar'), async (req, res) => {
    // const imagePath = path.join(__dirname, '/public/images')
    // const fileUpload = new Resize(imagePath)
    var imagepath = fs.readFileSync(req.file.path)
    var image_encode = imagepath.toString('base64')
    var contentType = req.file.mimetype
    var avatar = new Buffer(image_encode, 'base64')
    var fileStream = {
        data: avatar,
        contentType: contentType
    }
    const {
        uemail,
        name,
        upassword,
        cpassword
    } = req.body
    let errors = []

    if (!uemail || !name || !upassword || !cpassword) {
        errors.push({
            msg: 'Please enter all fields'
        })
    }

    if (upassword != cpassword) {
        errors.push({
            msg: 'Passwords do not match'
        });
    }

    if (upassword.length < 6) {
        errors.push({
            msg: 'Password must be at least 6 characters'
        });
    }

    if (errors.length > 0) {
        res.render('register', {
            errors,
            uemail,
            name,
            upassword,
            cpassword
        });
    } else {
        User.findOne({
            email: uemail
        }).then(user => {
            if (user) {
                errors.push({
                    msg: 'This email is already registered'
                })
                res.render('register', {
                    errors,
                    uemail,
                    name,
                    upassword,
                    cpassword
                });
            } else {
                // const filename = await fileUpload.save(req.file.buffer)
                const newUser = new User({
                    email: uemail,
                    name,
                    password: upassword,
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
                                    'success_msg',
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
    passport.authenticate('local', {
        successRedirect: '/v2/project',
        failureRedirect: '/users/auth',
        failureFlash: true
    })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/auth');
});

router.get('/:usr/myaccount', ensureAuthenticated, (req, res) => {
    var user = req.user
    if(req.params.usr != 'undefined' && user) {
        if(user._id == req.params.usr) {
            res.render('space/myaccount', {
                user,
                title: 'myaccount'
            });
        }
    }
})

router.post('/:usr/myaccount', ensureAuthenticated, (req, res) => {
    const {
        email,
        name,
        mobile
    } = req.body
    let errors = []

    if (!email || !name) {
        errors.push({
            msg: 'Please enter all fields'
        })
    } 

    if(errors.length == 0) {
        User.findOneAndUpdate({_id: req.user._id}, {
            email,
            name,
            mobile
        },{upsert: true, new: true}, (err, user) => {
            if (err) {
                req.flash('error_msg', 'Cannot update user account')
                res.redirect(`/users/${req.params.usr}/myaccount`);
            }

            req.flash('success_msg', 'User account updated!!')
            res.redirect(`/users/${req.params.usr}/myaccount`);
            
        })
    }
})

module.exports = router