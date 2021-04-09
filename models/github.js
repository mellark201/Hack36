const mongoose = require('mongoose');

const GithubSchema = mongoose.Schema({
    createId: {
        type: String,
        required: true
    },
    data: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('GitSchema', GithubSchema);