const express = require('express');
const auth = require('../middlewares/authMiddleware');
const ProjectController = require('../controllers/project.controller');

const router = express.Router();

router.post('/connect-project', auth, ProjectController.connectProject)

router.get('/get-connected-projects', auth, ProjectController.getconnectedprojects)

module.exports = router;