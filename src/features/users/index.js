const express = require('express');
const router = express.Router();

const AdminData = require('./data/user_data');
const { verifyToken } = require('../../configs/security');

router.get('/', verifyToken, AdminData.getProfile);
router.put('/', verifyToken, AdminData.updateProfile);
router.put('/password', verifyToken, AdminData.changePassword);

module.exports = router;
