const mongoose = require('mongoose');

const SavedarticlesSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    article: {
        type: String,
        required: true
    },
}, { timestamps: true });

const Savedarticles = mongoose.model('Savedarticles', SavedarticlesSchema);

module.exports = Savedarticles;