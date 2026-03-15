const User = require('../models/User.models');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!email.endsWith('@geu.ac.in')) {
      return res.status(400).json({ success: false, error: 'Only @geu.ac.in emails are allowed' });
    }

    const user = await User.create({
      name,
      email,
      password
    });

    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Login failed' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};