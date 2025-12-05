const mongoose = require('mongoose');

const SavedReposSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    repo_owner: {
        type: String,
        required: true
    },
    reponame: {
        type: String,
        required: true
    }
}, { timestamps: true });

const SavedRepos = mongoose.model('SavedRepos', SavedReposSchema);

module.exports = SavedRepos;