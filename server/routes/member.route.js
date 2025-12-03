const express = require('express');
const auth = require('../middlewares/authMiddleware');
const MemberController = require('../controllers/member.controller');
const upload = require('../middlewares/uploadMiddleware')

const router = express.Router();

router.post('/create-member-personaldata', auth, upload.single('profileimage'), MemberController.createMemberPersonalData)

router.post('/create-social-accounts', auth, MemberController.createSocialAccounts)

router.post('/create-education', auth, MemberController.createEducation)

router.post('/create-exp', auth, MemberController.createExp)

module.exports = router;