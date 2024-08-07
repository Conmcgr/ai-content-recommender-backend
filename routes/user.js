const express = require('express');
const {
  getUserData,
  updateUserData,
  updatePassword,
  addInterest,
  deleteInterest
} = require('../controllers/userController');
const router = express.Router();

// Middleware to extract userId from token (assuming token is used for authentication)
const extractUserId = (req, res, next) => {
  // Extract userId from token and set it in req.userId
  // For simplicity, let's assume we have a function getUserIdFromToken that extracts userId
  req.userId = getUserIdFromToken(req.headers.authorization);
  next();
};

router.use(extractUserId);

router.get('/profile', getUserData);
router.put('/profile', updateUserData);
router.post('/update-password', updatePassword);
router.post('/add-interest', addInterest);
router.post('/delete-interest', deleteInterest);

module.exports = router;

// Utility function to extract userId from token (this needs proper implementation)
function getUserIdFromToken(token) {
  // Implement your token extraction logic here
  // For example, using jwt.verify to decode the token and get the userId
  const decoded = jwt.verify(token, 'your_jwt_secret'); // replace 'your_jwt_secret' with your actual secret
  return decoded.userId;
}
