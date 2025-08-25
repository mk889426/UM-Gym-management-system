const express                = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const adminCtrl              = require('../controllers/adminController');

const router = express.Router();
router.use(verifyToken, authorizeRoles('admin'));

router.post('/members',      adminCtrl.addMember);
router.put('/members/:id',   adminCtrl.updateMember);
router.delete('/members/:id',adminCtrl.deleteMember);

router.post('/bills',        adminCtrl.createBill);
router.post('/notifications',adminCtrl.assignNotification);
router.get('/reports',       adminCtrl.exportReports);

router.post('/supplements',  adminCtrl.createSupplement);
router.get('/supplements',   adminCtrl.listSupplements);

router.post('/diet-details', adminCtrl.createDietDetail);
router.get('/diet-details',  adminCtrl.listDietDetails);

module.exports = router;