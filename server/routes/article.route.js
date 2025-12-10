const express = require('express');
const auth = require('../middlewares/authMiddleware');
const ArticleController = require('../controllers/article.controller');

const router = express.Router();

router.get('/get-articles', auth, ArticleController.gettoparticals)

router.post('/save-article', auth, ArticleController.saveArticle)

router.get('/saved-articles', auth, ArticleController.getSavedArticles)

module.exports = router;