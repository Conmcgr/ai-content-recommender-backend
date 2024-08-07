const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

exports.updateUserData = async (req, res) => {
  try {
    const userId = req.params.id;
    const { username, password, interests } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 12);
    if (interests) user.interests = interests;

    await user.save();

    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user data' });
  }
};
