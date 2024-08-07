const express = require('express');
const { getUserData, updateUserData } = require('../controllers/userController');
const router = express.Router();

router.get('/:id', getUserData);
router.put('/:id', updateUserData);

module.exports = router;
