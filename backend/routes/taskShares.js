const express = require('express');
const router = express.Router();
const taskShareController = require('../controllers/taskShareController');
const auth = require('../middleware/auth');

router.use(auth);

// Task Share routes
router.post('/', taskShareController.shareTask);
router.get('/shared-with-me', taskShareController.getSharedWithMe);
router.get('/my-shares', taskShareController.getMyShares);
router.put('/:id', taskShareController.updateSharePermission);
router.delete('/:id', taskShareController.removeShare);

module.exports = router;