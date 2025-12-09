const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project_name: {
        type: String,
        required: true,
    }
}, {timestamps: true});

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;