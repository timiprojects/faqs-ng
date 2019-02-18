const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const date = require('moment')
const {
    ensureAuthenticated
} = require('../config/auth');

//load user model
const User = require('../models/user')

//WELCOME PAGE
router.get('/', (req, res) => res.render('index', {
    user: req.user
}))

router.get('/v2/project', ensureAuthenticated, (req, res) => {
    res.render('welcome', {
        user: req.user,
        date
    })

})

//CREATE NEW FAQ PAGE
router.post('/v2/project', ensureAuthenticated, (req, res) => {
    const {
        title,
        userId
    } = req.body
    let errors = []
    User.findById(userId, (err, user) => {
        if (err) throw err;

        var proj = user.project.find(proj => proj.title === title)
        if (proj) {
            errors.push({
                msg: 'Project already exists'
            })
        }

        if (errors.length > 0) {
            res.render('welcome', {
                errors,
                title,
                user: req.user,
                date
            })
        } else {
            user.project.push({
                title
            })
            user.save().then((usr) => {
                // res.render('welcome', {
                //     user: usr,
                //     success_msg: ``
                // })
                req.flash('success_msg', `${title} created successfully`)
                 res.redirect('/v2/project');
            }).catch((err) => console.log(err))
        }
    })
})

//DELETE FAQ PAGE
router.delete('/v2/project/del/:del', ensureAuthenticated, (req, res) => {
    const {
        del
    } = req.params
    const {
        _id
    } = req.user

    User.findById(_id, (err, user) => {
        if (err) throw err;
        var projects = user.project

        if (projects) {
            var index = projects.findIndex(x => x._id == del);
            if (index) {
                projects.splice(index, 1);

                user.save().then(() => {
                    req.flash(
                        'success_msg',
                        'Project deleted successfully'
                    )
                    res.redirect('/v2/project');
                }).catch(err => {
                    throw err;
                })
            }

        }
    })
})

//GET ALL DATA FOR ONE FAQ PAGE 
router.get('/v2/project/:id/:f', ensureAuthenticated, (req, res, next) => {
    var {
        project
    } = req.user
    var per_page = 10

    var categoryArray = []
    var categoryList = []

    var questionArray = []
    var questionList = []
    var questionNewList = []

    var current_page = 1

    var projId = project.find(proj => proj._id == req.params.id)

    if (projId) {
        var cat = projId.category
        var len = cat.length
        if (req.params.f === 'categories') {
            var pageCount = Math.round((cat.length / per_page) + 0.5)

            while (cat.length > 0) {
                categoryArray.push(cat.splice(0, per_page))
            }
            //set current page if specifed as get variable (eg: /?page=2)
            if (typeof req.query.page !== 'undefined') {
                current_page = +req.query.page;
            }
            categoryList = categoryArray[+current_page - 1];
            res.render('space/dashboard', {
                user: req.user,
                project: projId,
                proj_id: projId._id,
                title: req.params.f,
                categories: categoryList,
                per_page,
                totalCategories: len,
                pageCount,
                current_page
            })
        } else if (req.params.f === 'questions') {
            for (let index = 0; index < cat.length; index++) {
                var rev = cat[index].question;

                for (let i = 0; i < rev.length; i++) {
                    questionNewList.push(rev[i])
                }
            }
            var pageCount = Math.round((questionNewList.length / per_page) + 0.5)
            while (questionNewList.length > 0) {
                questionArray.push(questionNewList.splice(0, per_page))
            }
            if (typeof req.query.page !== 'undefined') {
                current_page = +req.query.page || 1;
            }
            questionList = questionArray[+current_page - 1]
            res.render('space/dashboard', {
                user: req.user,
                project: projId,
                proj_id: projId._id,
                title: req.params.f,
                categories: cat,
                questions: questionList,
                per_page,
                totalCategories: len,
                pageCount,
                current_page
            });
        } else {
            res.render('space/dashboard', {
                user: req.user,
                title: req.params.f,
                project: projId
            })
        }
    }
})

//CREATE CATEGORIES AND QUESTIONS FOR A FAQ PAGE
router.post('/v2/project/:id/:f', ensureAuthenticated, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) throw err;
        if (user.project) {
            var proj = user.project.find(x => x._id == req.params.id)
            if (proj) {
                if (req.params.f === 'categories') {
                    var tim = proj.category
                    var fin = tim.find(x => x.title == req.body.title)
                    if (!fin) {
                        proj.category.push({
                            title: req.body.title,
                            alias: req.body.alias
                        })
                        user.save().then(response => {
                            req.flash(
                                'success_msg',
                                'Category created successfully'
                            );
                            res.redirect(`/v2/project/${req.params.id}/${req.params.f}`);
                        }).catch((err) => {
                            throw err;
                        })
                    } else {
                        req.flash(
                            'success_msg',
                            'Category already exists'
                        );
                        res.redirect(`/v2/project/${req.params.id}/${req.params.f}`);
                    }
                } else if (req.params.f === 'questions') {
                    var getCat = proj.category
                    var checkCat = getCat.find(x => x._id == req.body.cats)
                    //console.log(checkCat)
                    if (checkCat) {
                        var getQuestion = checkCat.question
                        var checkQuestion = getQuestion.find(x => x.question === req.body.question)
                        if (!checkQuestion) {
                            getQuestion.push({
                                question: req.body.question,
                                answer: req.body.answer,
                                cat: req.body.cats
                            })
                            user.save().then(response => {
                                req.flash(
                                    'success_msg',
                                    'Question created successfully'
                                )
                                res.redirect(`/v2/project/${req.params.id}/${req.params.f}`)
                            }).catch((err) => {
                                throw err;
                            })
                        }
                    }
                } else if (req.params.f === 'settings') {
                    var arr = "ABCDEFGHIJKLMNOPRSTUVWXYZ123456789abcdefghijlmnopqrstuvwxyz-_";
                    var char = arr.length;
                    var seckey = "";
                    for (var i = 0; i < 10; i++) {
                        seckey += arr.charAt(Math.round(Math.random() * char))
                    }
                    if (req.body.name != 'undefined') {
                        proj.isGenerated = true,
                        proj.code = `${req.body.name}/v2/${proj._id}/${seckey}/${req.user._id}`
                        proj.seckey = seckey
                        user
                            .save()
                            .then(() => {
                                req.flash(
                                    'success_msg',
                                    'Code generated successfully!!'
                                );
                                res.redirect(`/v2/project/${req.params.id}/${req.params.f}`)
                            })
                            .catch(err => {
                                req.flash(
                                    'error_msg',
                                    err
                                );
                                res.redirect(`/v2/project/${req.params.id}/${req.params.f}`)
                            });
                    }
                }
            }
        }
    })
})

//CODE TO LOAD CONTENT FROM SITE GENERATED SCRIPT
router.get('/v2/:pid/:seckey/:usrId', (req, res) => {
    var seckey = req.params.seckey
    if (typeof seckey !== 'undefined') {
        User.findById(req.params.usrId, (err, user) => {
            if (err) return res.status(500).json(err);
            var project = user.project
            var findProject = project.find(x => x._id == req.params.pid)
            if (findProject) {
                if(findProject.seckey === seckey) {
                    var categories = findProject.category
                    res.render('temp', {
                        categories,
                        projectId: findProject,
                        usr_id: req.params.usrId
                    })
                }
            }
        })
    }
})

//TRACK QUESTION CLICKS
router.post('/v2/track', (req, res) => {
    const { sec, pid, uid, cid, qid } = req.body
    
    req.headers["content-type"] == 'application/json'
    req.headers["access-control-allow-origin"] == '*'

    User.findById(uid, (err, user) => {
        if(err) return  res.json(err)
        if(user) {
            var project = user.project
            var getProject = project.find(x=>x._id == pid)
            if(getProject){
                if(getProject.seckey == sec) {
                    var Cat = getProject.category
                    var getCat = Cat.find(x=>x._id == cid)
                    if(getCat) {
                        var quest = getCat.question
                        var getQ = quest.find(x=>x._id == qid)
                        if(getQ) {
                            getQ.clicks = (parseInt(getQ.clicks) + 1)
                            user.save()
                                .then(() => {
                                    res.json(getQ.clicks)
                                })
                                .catch((err) => {
                                     res.json(err);
                                })
                        }
                         
                    }
                }
            }
        }
    })
})


//DELETE QUESTIONS AND CATEGORIES FROM A FAQ PAGE
router.delete('/v2/project/:id/:f/:del', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) throw err;
        if (user.project) {
            var proj = user.project.find(proj => proj._id == req.params.id)
            if (proj) {
                var tim = proj.category
                if (req.params.f === 'categories') {
                    var fin = tim.findIndex(x => x._id == req.params.del)
                    tim.splice(fin, 1)
                    user.save().then((response) => {
                        //console.log('Deleted')
                        req.flash('success_msg', 'category deleted!')
                        //res.status(200).json('Deleted');
                        res.redirect(`/v2/project/${req.params.id}/${req.params.f}`);
                    }).catch((err) => {
                        throw err;
                    })
                } else if (req.params.f === 'questions') {
                    var findCat = tim.find(x => x._id == req.params.del)
                    if (findCat) {
                        var checkQuestion = findCat.question
                        var findQuestion = checkQuestion.findIndex(x => x._id == req.body.qId)
                        if (findQuestion) {
                            checkQuestion.splice(findQuestion, 1)
                            user.save().then((response) => {
                                //console.log('Deleted')
                                req.flash('success_msg', 'question deleted!')
                                //res.status(200).json('Deleted');
                                res.redirect(`/v2/project/${req.params.id}/${req.params.f}`);
                            }).catch((err) => {
                                throw err;
                            })
                        }
                    }
                }

            }
        }
    })
})


module.exports = router