exports.getProfile = (req, res) => {
    res.json({
      message: 'User Profile',
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  };
  