const bcrypt       = require('bcryptjs');

const User         = require('../models/User');
const Member       = require('../models/Member');
const Bill         = require('../models/Bill');
const Notification = require('../models/Notification');
const Supplement   = require('../models/Supplement');
const DietDetail   = require('../models/DietDetails');


exports.promoteToMember = async (req, res) => {
  const { username, name, contact, address, feePackage } = req.body;

  if (!username || !name || !contact || !address) {
    return res.status(400).json({ msg: 'username, name, contact & address required' });
  }

  try {
    // Find existing user
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if already a member
    const existingMember = await Member.findOne({ user: user._id });
    if (existingMember) {
      return res.status(400).json({ msg: 'User is already a member' });
    }

    // Create member profile
    const member = await Member.create({
      user: user._id,
      name,
      contact,
      address,
      feePackage
    });

    // Optionally update role in User collection
    user.role = 'member';
    await user.save();

    res.json({ msg: 'User promoted to member', member });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });

    if (req.body.name)       member.name       = req.body.name;
    if (req.body.feePackage) member.feePackage = req.body.feePackage;

    await member.save();
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });

    await User.findByIdAndDelete(member.user);
    await Bill.deleteMany({ member: member._id });
    await Notification.deleteMany({ member: member._id });
    await DietDetail.deleteMany({ member: member._id });
    await member.remove();

    res.json({ msg: 'Member deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createBill = async (req, res) => {
  const { memberId, amount, date } = req.body;
  if (!memberId || amount == null || !date) {
    return res.status(400).json({ msg: 'memberId, amount & date required' });
  }
  try {
    const bill = await Bill.create({ member: memberId, amount, date });
    res.json(bill);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.assignNotification = async (req, res) => {
  const { memberId, message, date } = req.body;
  if (!memberId || !message || !date) {
    return res.status(400).json({ msg: 'memberId, message & date required' });
  }
  try {
    const notice = await Notification.create({ member: memberId, message, date });
    res.json(notice);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.exportReports = async (_req, res) => {
  try {
    const members       = await Member.find().populate('user','username role');
    const bills         = await Bill.find();
    const notifications = await Notification.find();
    res.json({ members, bills, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.createSupplement = async (req, res) => {
  const { name, price, stock = 0 } = req.body;
  if (!name || price == null) {
    return res.status(400).json({ msg: 'name & price required' });
  }
  try {
    const item = await Supplement.create({ name, price, stock });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.listSupplements = async (_req, res) => {
  const list = await Supplement.find();
  res.json(list);
};

exports.createDietDetail = async (req, res) => {
  const { memberId, dietPlan } = req.body;
  if (!memberId || !dietPlan) {
    return res.status(400).json({ msg: 'memberId & dietPlan required' });
  }
  try {
    const detail = await DietDetail.create({ member: memberId, dietPlan });
    res.json(detail);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.listDietDetails = async (_req, res) => {
  const list = await DietDetail.find();
  res.json(list);
};