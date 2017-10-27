const mongoose = require('mongoose');

exports.Llama = mongoose.model('Llama', {
    name: {
        type: String, 
        required: true
    }, 
    age: {
        type: Number,
        required: false
    }, 
    picture_url: {
        type: String,
        required: false
    },
    description: {
        type: String, 
        required: false
    },
    location: {
        type: String,
        required: false
    }
});

module.exports = exports;