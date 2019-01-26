const mongoose = require('mongoose')

const QuestionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true
    },
    cat: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
})
mongoose.model('Question', QuestionSchema)

const catSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    alias: {
        type: String,
        required: true,
        lowercase: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    question: [QuestionSchema]
})
mongoose.model('Category', catSchema)

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    category: [catSchema]
})
mongoose.model('Project', projectSchema)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    project: [projectSchema]
})
const User = mongoose.model('Company', userSchema)


module.exports = User