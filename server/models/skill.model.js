const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skill: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    exp_years: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

const Skill = mongoose.model('Skill', SkillSchema);

module.exports = Skill;