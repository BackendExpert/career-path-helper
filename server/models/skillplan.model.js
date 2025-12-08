const mongoose = require('mongoose');

const SkillPlanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: [
        {
            type: String,
            required: true
        }
    ]
}, { timestamps: true });

const SkillPlan = mongoose.model('SkillPlan', SkillPlanSchema);

module.exports = SkillPlan;