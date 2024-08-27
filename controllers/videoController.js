const Video = require('../models/Videos');
const User = require('../models/Users');
const model = require('../ml/model.py')

exports.getTop3 = async (req, res) => {
    try {
      const userId = req.userId; // Assuming userId is available in the request
      const user = await User.findById(userId);
  
      if (!user) return res.status(404).json({ error: 'User not found' });

      //Call the model function

      //Return the top 3 video ids (maybe return the whole video object)
      res.status(200).json({ username: user.username, interests: user.interests });
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user data' });
    }
  };