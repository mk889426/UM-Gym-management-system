const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');

const User      = require('../models/User');
const Blacklist = require('../models/Blacklist');

const SECRET = process.env.JWT_SECRET;

exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ msg: 'username & password required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { id: user._id, username: user.username, role: user.role };
    const token   = jwt.sign(payload, SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.logout = async (req, res) => {
  const header = req.headers.authorization;
  if (!header) return res.status(400).json({ msg: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    await Blacklist.create({ token });
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};