// memberController.js
const Bill = require('../models/Bill');
const Member = require('../models/Member');
const Notification = require('../models/Notification');
const DietDetail = require('../models/DietDetails')
exports.getMemberDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get member profile (linked to user)
    const member = await Member.findOne({ user: userId }).select('name feePackage');
    if (!member) {
      return res.status(404).json({ msg: 'Member not found' });
    }

    // 2. Get notifications
    const notifications = await Notification.find({ member: member._id })
      .sort({ date: -1 })
      .lean();

    // 3. Get bills
    const bills = await Bill.find({ member: member._id })
      .sort({ date: -1 })
      .lean();

    // 4. Get diet details
    const diets = await DietDetail.find({ member: member._id })
      .sort({ createdAt: -1 })
      .lean();

    const dietPlans = diets.map((d) => ({
      id: d._id,
      memberId: member._id,
      memberName: member.name,
      dietPlan: d.dietPlan,
      createdDate: d.createdAt,
    }));

    res.json({
      member: {
        id: member._id,
        name: member.name,
        feePackage: member.feePackage,
      },
      stats: {
        notificationsCount: notifications.length,
        billsCount: bills.length,
        dietCount: dietPlans.length, // optional stat
      },
      notifications,
      bills,
      dietPlans,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
