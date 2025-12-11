const express = require('express');
const auth = require('../middlewares/authMiddleware');
const QuestionController = require('../controllers/question.controller');

const router = express.Router();

router.get('/get-question', auth, QuestionController.seachQuestion)

module.exports = router;