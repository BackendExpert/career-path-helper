const mongoose = require('mongoose');

const AIProjectSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    promt: {
        type: String,
        required: true
    },
    text: [
        {
            project_name: { type: String },
            description: { type: String },
            tech: { type: String },
            whygood: { type: String },
            steps: { type: String },
            suggestions: { type: String },
        }
    ]
}, { timestamps: true });

const AIProject = mongoose.model('AIProject', AIProjectSchema);
module.exports = AIProject;
