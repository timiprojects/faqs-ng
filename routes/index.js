const express = require('express')
const router = express.Router()
const {
    ensureAuthenticated
} = require('../config/auth');

//load user model
const User = require('../models/user')

//WELCOME PAGE
router.get('/', (req, res) => res.render('index'))

router.get('/v2/project', ensureAuthenticated, (req, res) => {
    res.render('welcome', {
        user: req.user,
    })

})

router.post('/v2/project', ensureAuthenticated, (req, res) => {
    const {
        title,
        userId
    } = req.body
    let errors = []
    User.findById(req.body.userId, (err, user) => {
        if (err) throw err;

        // user.project.push({title})
        // user.save().then((usr) => {
        //     res.render('welcome', {
        //         user: usr
        //     })
        // }).catch((err) => console.log(err))

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
                user: req.user
            })
        } else {
            user.project.push({
                title
            })
            user.save().then((usr) => {
                res.render('welcome', {
                    user: usr,
                    success_msg: `${title} created successfully`
                })
            }).catch((err) => console.log(err))
        }
    })
})

//router.post()

//dashboard
// router.get('/v2/project/:id/:f', ensureAuthenticated, (req, res) => {
//     var {
//         project
//     } = req.user
//     var projId = project.find(proj => proj._id == req.params.id)

//     if (projId) {
//         if (req.params.f === 'categories') {
//             res.render('space/dashboard', {
//                 user: req.user,
//                 title: req.params.f,
//                 proj_id: projId._id,
//                 categories: projId.category
//             })
//         } else if (req.params.f === 'questions') {
//             var count = projId.category
//             res.render('space/dashboard', {
//                 user: req.user,
//                 title: req.params.f,
//                 proj_id: projId._id,
//                 categories: count
//             })
//         } else {
//             res.render('space/dashboard', {
//                 user: req.user,
//                 title: req.params.f,
//                 project: projId
//             })
//         }
//     } else {
//         req.flash('No project exits!')
//         res.redirect('/v2/project');
//     }


// })

router.get('/v2/project/:id/:f', ensureAuthenticated, (req, res, next) => {
    var {
        project
    } = req.user
    var per_page = 8

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

        //console.log(pageCount)

        //console.log(categoryList)
        if (req.params.f === 'categories') {
            var pageCount = ((cat.length / per_page) + 1).toFixed()

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
                proj_id: projId._id,
                title: req.params.f,
                categories: categoryList,
                per_page,
                totalCategories: len,
                pageCount,
                current_page
            });
        } else if (req.params.f === 'questions') {
            for(let index = 0; index < cat.length; index++) {
                var rev = cat[index].question;

                for(let i = 0; i < rev.length; i++) {
                    questionNewList.push(rev[i])
                }
            }

            var pageCount = ((questionNewList.length / per_page)).toFixed()

            console.log(questionNewList.length)
            console.log(pageCount)

            while(questionNewList.length > 0) {
                questionArray.push(questionNewList.splice(0, per_page))
            }

            if (typeof req.query.page !== 'undefined') {
                current_page = req.query.page || 1;
            }

            questionList = questionArray[+current_page - 1]

            res.render('space/dashboard', {
                user: req.user,
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

        //console.log("current_page: " + current_page)
    }



})


router.post('/v2/project/:id/:f', ensureAuthenticated, (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) throw err;

        if (user.project) {
            var proj = user.project.find(proj => proj._id == req.params.id)
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
                            // res.render('space/dashboard', {
                            //     user: req.user,
                            //     title: req.params.f,
                            //     proj_id: proj._id,
                            //     categories: proj.category,
                            //     success_msg: `Category created successfully`
                            // })
                            res.redirect(`/v2/project/${req.params.id}/${req.params.f}`);
                        }).catch((err) => {
                            throw err;
                        })
                    } else {
                        res.render('space/dashboard', {
                            user: req.user,
                            title: req.params.f,
                            proj_id: proj._id,
                            categories: proj.category,
                            error_msg: `Category already exists`
                        })
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
                                //console.log(response)
                                res.render('space/dashboard', {
                                    user: req.user,
                                    title: req.params.f,
                                    proj_id: proj._id,
                                    categories: proj.category,
                                    success_msg: `Question created successfully`
                                })
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

router.delete('/v2/project/:id/:f/:del', (req, res) => {
    User.findById(req.user._id, (err, user) => {
        if (err) throw err;

        if (user.project) {
            var proj = user.project.find(proj => proj._id == req.params.id)
            if (proj) {
                var tim = proj.category
                var fin = tim.findIndex(x => x._id == req.params.del)
                tim.splice(fin, 1)
                user.save().then((response) => {
                    //console.log('Deleted')
                    req.flash('category deleted!')
                    res.status(200).json('Deleted');
                    // res.redirect(`/v2/project/${req.params.id}/${req.params.f}`);
                }).catch((err) => {
                    console.log(err)
                })
            }
        }
    })

})



module.exports = router