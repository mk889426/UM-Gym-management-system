const express                = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const adminCtrl              = require('../controllers/adminController');

const router = express.Router();
router.use(verifyToken, authorizeRoles('admin'));

router.post('/members', adminCtrl.promoteToMember);
router.get('/members', adminCtrl.listMembers)
router.put('/members/:id',   adminCtrl.updateMember);
router.delete('/members/:id',adminCtrl.deleteMember);

router.get('/bills', adminCtrl.listBills);
router.post('/bills',        adminCtrl.createBill);
router.put('/bills/:id/status', adminCtrl.updateBillStatus);

router.post('/notifications',adminCtrl.assignNotification);
router.get('/reports',       adminCtrl.exportReports);

router.post('/supplements',  adminCtrl.createSupplement);
router.get('/supplements',   adminCtrl.listSupplements);

router.post('/diet-details', adminCtrl.createDietDetail);
router.get('/diet-details',  adminCtrl.listDietDetails);

module.exports = router;