const mongoose = require('mongoose');

const MemberSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    fname: { type: String },
    lname: { type: String },
    mobile: { type: String },

    education: [
        {
            school: { type: String },
            course: { type: String },
            startat: { type: Date },
            endat: { type: Date },
        }
    ],

    exp: [
        {
            workplace: { type: String },
            job: { type: String },
            startat: { type: Date },
            endat: { type: Date },
        }
    ],

    aiapi: { type: String }
});

module.exports = mongoose.model('Member', MemberSchema);
