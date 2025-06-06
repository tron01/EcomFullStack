const crypto = require('crypto');
const User = require('../models/User');
const { sendPasswordResetEmail } = require('../utils/mailService');

// POST /forgot-password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpire = Date.now() + 1000 * 60 * 15; // 15 min
  await user.save();

  await sendPasswordResetEmail(email, token);
  res.json({ message: 'Password reset email sent' });
};

// POST /reset-password
exports.resetPassword = async (req, res) => {
  const { token, newpassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.password = newpassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpire = null;
  await user.save();

  res.json({ message: 'Password updated successfully' });
};
