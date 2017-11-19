const mongoose = require('mongoose');

let PostSchema = new mongoose.Schema({
    user_id: {
        type: String, 
        required: true
    },
    text: {
        type: String,
        required: true
    }
});

let Post = mongoose.model('Post', PostSchema);

module.exports = { Post }
