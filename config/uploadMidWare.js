const multer = require('multer')
const path = require('path')
const uuidv4 = require('uuid/v4')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/public/images'))
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}_${uuidv4()}-${Date.now()}.jpg`)
    }
})

const uploads = multer({
    limits: {
        fileSize: 4 * 1024 * 1024
    },
    storage: storage
})

module.exports = uploads