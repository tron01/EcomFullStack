const User = require('../models/User'); // Adjust the path as needed

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      message: 'User Profile',
      user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};