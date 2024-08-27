const User = require('../models/User');
const bcrypt = require('bcryptjs');
const model = require('../ml/model.py')

// Get user data
exports.getUserData = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in the request
    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ username: user.username, interests: user.interests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user data' });
  }
};

// Update user data (username and interests)
exports.updateUserData = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in the request
    const { username, interests } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username;
    if (interests) user.interests = interests;

    await user.save();

    res.status(200).json({ message: 'User data updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user data' });
  }
};

// Update password
exports.updatePassword = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in the request
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Current password is incorrect' });

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update password' });
  }
};

// Add interest
exports.addInterest = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in the request
    const { interest } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    if (!user.interests.includes(interest)) {
      user.interests.push(interest);
    }

    await user.save();

    res.status(200).json({ message: 'Interest added successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add interest' });
  }
};

// Delete interest
exports.deleteInterest = async (req, res) => {
  try {
    const userId = req.userId; // Assuming userId is available in the request
    const { interest } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    user.interests = user.interests.filter(i => i !== interest);

    await user.save();

    res.status(200).json({ message: 'Interest deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete interest' });
  }
};


//Sudo code-y
exports.rateVideo = async (req, res) => {
  try {
    const userId = req.userId;
    const { video, rating } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    let cur_avg = user.average_video;
    let cur_rates = user.total_ratings;
    let cur_tot_vids = user.total_videos;

    try {
      const output = model.update_average_video_embedding(cur_avg, cur_rates, video, rating);
    } catch (error) {
      res.status(500).json({ error: 'Model failed to rate new video' });
    }

    user.average_video = output[0];
    user.total_ratings = output[1];
    user.total_videos = cur_tot_vids + 1;

    await user.save();

  } catch (error) {
    res.status(500).json({ error: 'Failed to rate video' });
  }
}
