const express                     = require('express');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const userCtrl                    = require('../controllers/userController');

const router = express.Router();
router.use(verifyToken, authorizeRoles('user'));

router.get('/details', userCtrl.viewDetails);
router.get('/search',  userCtrl.searchMembers);

module.exports = router;