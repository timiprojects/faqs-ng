const mongoose = require('mongoose')
const musersSchema = new mongoose.Schema({
    device: {
        type: String
    },
    country: String,
    country_code: {
        type: String,
        unique: true
    },
    ip: String
})
mongoose.model('musers', musersSchema)
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
    clicks: {
        type: Number,
        default: 0
    },
    musers: [musersSchema],
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
    color: {
        type: String,
        default: 'black',
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
    webUrl: {
        type: String,
    },
    category: [catSchema],
    isActive: {
        type: Number,
        default: 0,
    },
    isGenerated: {
        type: Boolean,
        default: false
    },
    seckey: {
        type: String
    },
    code: {
        type: String
    }
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
    avatar: {
        data: Buffer,
        contentType: String
    },
    passwordResetToken: {
        type: String
    },
    passwordTokenExpiry: {
        type: Date
    },
    date: {
        type: Date,
        default: Date.now
    },
    project: [projectSchema]
})
const User = mongoose.model('Company', userSchema)


module.exports = User