const express = require('express');
const auth = require('../middlewares/authMiddleware');
const SkillController = require('../controllers/skill.controller');

const router = express.Router();

router.post('/create-skill', auth, SkillController.createNewSkill)

router.get('/get-all-skills', auth, SkillController.getallskills)

router.delete('/delete-skill', auth, SkillController.removeSkill)

module.exports = router;