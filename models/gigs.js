const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

const gigSchema = new Schema({
    venueName: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    pay: {
        type: String,
        required: true,
        min: 0
    },
    email: {
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
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

const Gig = mongoose.model('Gig', gigSchema);

module.exports = Gig;