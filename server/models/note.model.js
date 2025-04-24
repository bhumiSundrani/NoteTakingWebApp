const mongoose = require('mongoose')

const noteSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    recentlyDeleted: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: "user",
        required: true
    }
}, {timestamps: true})

const Note = mongoose.model('note', noteSchema)

module.exports = Note