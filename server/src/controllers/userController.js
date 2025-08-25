const User   = require('../models/User');
const Member = require('../models/Member');

exports.viewDetails = async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
};

exports.searchMembers = async (req, res) => {
  const q = (req.query.q || '').toString().trim();
  if (!q) return res.status(400).json({ msg: 'q query param required' });

  const results = await Member.find({
    name: new RegExp(q, 'i')
  });
  res.json(results);
};