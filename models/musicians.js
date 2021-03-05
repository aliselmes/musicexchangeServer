const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicianSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true 
});

const Musician = mongoose.model('Musician', musicianSchema);

module.exports = Musician;