const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({

});

const Question = mongoose.model('Question', QuestionSchema);

module.exports = Question;