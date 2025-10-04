const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Member = require('../models/Member');
const Bill = require('../models/Bill');
const Notification = require('../models/Notification');
const Supplement = require('../models/Supplement');
const DietDetail = require('../models/DietDetails');


exports.promoteToMember = async (req, res) => {
  const { username, name, contact, address, feePackage, joinDate } = req.body;
  console.log("req.body === ", req.body)
  console.log("response.body === ", res)

  const users = await User.find({});
  console.log(users);


  if (!username || !name || !contact || !address) {
    return res.status(400).json({ msg: 'username, name, contact & address required' });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    const existingMember = await Member.findOne({ user: user._id });
    if (existingMember) {
      return res.status(400).json({ msg: 'User is already a member' });
    }

    const member = await Member.create({
      user: user._id,
      name,
      contact,
      address,
      feePackage,
      joinDate: joinDate || Date.now()
    });

    user.role = 'member';
    await user.save();

    res.json({ msg: 'User promoted to member', member });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


// controllers/adminController.js
exports.updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: 'Member not found' });

    // Update allowed fields only
    if (req.body.name) member.name = req.body.name;
    if (req.body.contact) member.contact = req.body.contact;
    if (req.body.address) member.address = req.body.address;
    if (req.body.feePackage) member.feePackage = req.body.feePackage;
    if (req.body.joinDate) member.joinDate = req.body.joinDate;

    await member.save();
    res.json(member);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};


// DELETE /admin/members/:id
exports.deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) return res.status(404).json({ msg: "Member not found" });

    await member.deleteOne();
    res.json({ msg: "Member deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};


// controllers/adminController.js
exports.createBill = async (req, res) => {
  const { memberId, amount, date, status } = req.body;
  if (!memberId || amount == null || !date) {
    return res.status(400).json({ msg: 'memberId, amount & date required' });
  }
  try {
    const bill = await Bill.create({
      member: memberId,
      amount,
      date,
      status: status || 'pending'
    });

    const populated = await bill.populate('member', 'name');
    res.json({
      id: populated._id,
      memberId: populated.member._id,
      memberName: populated.member.name,
      amount: populated.amount,
      date: populated.date,
      status: populated.status
    });
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
    const members = await Member.find().populate('user', 'username role');
    const bills = await Bill.find();
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


// ✅ Update supplement
exports.updateSupplement = async (req, res) => {
  try {
    const { id } = req.params
    const { name, price, stock } = req.body

    const supplement = await Supplement.findById(id)
    if (!supplement) {
      return res.status(404).json({ msg: "Supplement not found" })
    }

    if (name !== undefined) supplement.name = name
    if (price !== undefined) supplement.price = price
    if (stock !== undefined) supplement.stock = stock

    await supplement.save()
    res.json(supplement)
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
}

// ✅ Delete supplement
exports.deleteSupplement = async (req, res) => {
  try {
    const { id } = req.params
    const supplement = await Supplement.findById(id)
    if (!supplement) {
      return res.status(404).json({ msg: "Supplement not found" })
    }

    await supplement.deleteOne()
    res.json({ msg: "Supplement deleted successfully", id })
  } catch (err) {
    console.error(err)
    res.status(500).send("Server error")
  }
}


exports.createDietDetail = async (req, res) => {
  const { memberId, dietPlan } = req.body;
  if (!memberId || !dietPlan) {
    return res.status(400).json({ msg: "memberId & dietPlan required" });
  }
  try {
    const detail = await DietDetail.create({ member: memberId, dietPlan });
    await detail.populate("member", "name"); // fetch member name for frontend
    res.json(detail);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// LIST
exports.listDietDetails = async (req, res) => {
  try {
    const details = await DietDetail.find().populate("member", "name");
    res.json(details);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// UPDATE
exports.updateDietDetail = async (req, res) => {
  const { id } = req.params;
  const { dietPlan } = req.body;

  if (!dietPlan) return res.status(400).json({ msg: "dietPlan required" });

  try {
    const updated = await DietDetail.findByIdAndUpdate(
      id,
      { dietPlan },
      { new: true }
    ).populate("member", "name");

    if (!updated) return res.status(404).json({ msg: "DietDetail not found" });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// DELETE
exports.deleteDietDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await DietDetail.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ msg: "DietDetail not found" });
    res.json({ msg: "Diet detail deleted", id });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

exports.listMembers = async (req, res) => {
  try {
    const members = await Member.find()
      .populate('user', 'username email') // optionally include user details like username, email
      .sort({ name: 1 }) // sort by name or any other criteria

    res.json({ members })
  } catch (err) {
    console.error(err)
    res.status(500).json({ msg: 'Server error' })
  }
}

exports.listBills = async (req, res) => {
  try {
    const bills = await Bill.find()
      .populate('member', 'name')
      .sort({ date: -1 });

    const formatted = bills.map((b) => ({
      id: b._id,
      memberId: b.member._id,
      memberName: b.member.name,
      amount: b.amount,
      date: b.date,
      status: b.status,
    }));

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updateBillStatus = async (req, res) => {
  const { id } = req.params;  // bill id from URL
  const { status } = req.body;

  if (!['paid', 'pending'].includes(status)) {
    return res.status(400).json({ msg: 'Invalid status value' });
  }

  try {
    const bill = await Bill.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('member', 'name');

    if (!bill) return res.status(404).json({ msg: 'Bill not found' });

    res.json({
      id: bill._id,
      memberId: bill.member._id,
      memberName: bill.member.name,
      amount: bill.amount,
      date: bill.date,
      status: bill.status,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};