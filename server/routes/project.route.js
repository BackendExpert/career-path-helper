const express = require('express');
const auth = require('../middlewares/authMiddleware');
const ProjectController = require('../controllers/project.controller');

const router = express.Router();

router.post('/connect-project', auth, ProjectController.connectProject)

router.get('/get-connected-projects', auth, ProjectController.getconnectedprojects)

router.post('/create-ai-project', auth, ProjectController.createAIProjectsuggestions)

module.exports = router;