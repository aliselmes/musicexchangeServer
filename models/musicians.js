const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const musicianSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

const Musician = mongoose.model('Musician', musicianSchema);

module.exports = Musician;