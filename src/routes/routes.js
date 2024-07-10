const express = require('express');
const router = express.Router();
const admin = require('../features/users/index');
const auth = require('../features/authentication/index');

router.get('/', (req, res) => {
  res.send('Hello World');
});

// auth routes
router.use('/auth', auth);
router.use('/admin', admin);

module.exports = router;
