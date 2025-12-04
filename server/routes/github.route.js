const express = require('express');
const auth = require('../middlewares/authMiddleware');
const GithubController = require('../controllers/github.controller');

const router = express.Router();

router.get('/github-profile', auth, GithubController.getUserProfile)

module.exports = router;