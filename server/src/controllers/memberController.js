const Bill         = require('../models/Bill');
const Notification = require('../models/Notification');

exports.viewBills = async (req, res) => {
  const bills = await Bill.find({ member: req.user.id });
  res.json(bills);
};

exports.viewNotifications = async (req, res) => {
  const notes = await Notification.find({ member: req.user.id });
  res.json(notes);
};