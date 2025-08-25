const express                     = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const memberCtrl                  = require('../controllers/memberController');

const router = express.Router();
router.use(verifyToken, authorizeRoles('member'));

router.get('/bills',         memberCtrl.viewBills);
router.get('/notifications', memberCtrl.viewNotifications);

module.exports = router;