const express = require('express');
const auth = require('../middlewares/authMiddleware');
const MemberController = require('../controllers/member.controller');

const router = express.Router();

router.post('/create-member-personaldata', auth, MemberController.createMemberPersonalData)

module.exports = router;