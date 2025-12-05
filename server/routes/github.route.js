const express = require('express');
const auth = require('../middlewares/authMiddleware');
const GithubController = require('../controllers/github.controller');

const router = express.Router();

router.get('/github-profile', auth, GithubController.getUserProfile)

router.get('/github-repos', auth, GithubController.getallrepos)

router.post('/search-repo', auth, GithubController.seachgithubrepos)

router.post('/save-repo', auth, GithubController.saveRepo)

module.exports = router;