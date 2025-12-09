const express = require('express');
const auth = require('../middlewares/authMiddleware');
const SkillController = require('../controllers/skill.controller');

const router = express.Router();

router.post('/create-skill', auth, SkillController.createNewSkill)

router.get('/get-all-skills', auth, SkillController.getallskills)

router.delete('/delete-skill/:id', auth, SkillController.removeSkill)

router.post('/genarate-skill-plan', auth, SkillController.genarateSkillPlan)

router.get('/get-skill-plans', auth, SkillController.getAllSkillPlans)

module.exports = router;