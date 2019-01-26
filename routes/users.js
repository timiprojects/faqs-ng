const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const { ensureAuthenticated } = require('../config/auth')

//load user model
const User = require('../models/user')

//REGISTER PAGE
router.get('/register', (req, res) => res.render('register'))

//REGISTER NEW USER
router.post('/register', (req, res) => {
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
    }

    if (password.length < 6) {
        errors.push({
            msg: 'Password must be at least 6 characters'
        });
    }

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
            email: email
        }).then(user => {
            if (user) {
                errors.push({
                    msg: 'This email is already registered'
                })
                res.render('register', {
                    errors,
                    email,
                    name,
                    password,
                    cpassword
                });
            } else {
                const newUser = new User({
                    email,
                    name,
                    password
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
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        })
    }
})

//LOGIN PAGE
router.get('/login', (req, res) => res.render('login'))

//USER LOGIN
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/v2/project',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
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