const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res, next) => {
  try {
    const { name, email, password , confirmPassword} = req.body;
    
    //  Validate password
    // if (!password || password.length < 6) {
    //   return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    // }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Confirm password match
     if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    const user = await User.create({ 
        name,
        email, 
        password, 
        role: 'user' });
    
    const token = generateToken(user);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 86400000,
      })
      .status(201)
      .json({ message: 'User registered', user: { id: user._id, name, email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 86400000,
      })
      .json({ message: 'Logged in', user: { id: user._id, name: user.name, email, role: user.role } });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
};

exports.test = (req, res) => {
  res.json({ message: 'Test endpoint...' });
};
exports.getMe = (req, res) => {

  const { id,role } = req.user;

  res.json({ id,role });

};