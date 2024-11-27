const express = require('express');
const router = express.Router();
const { protect, authorize, checkPermission } = require('../middleware/auth');
const {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserRoles
} = require('../controllers/userController');

// All routes below this middleware are protected and require authentication
router.use(protect);

// Admin only routes
router.use(authorize('admin'));

router
    .route('/')
    .get(checkPermission('read_users'), getUsers);

router
    .route('/:id')
    .get(checkPermission('read_users'), getUser)
    .put(checkPermission('update_users'), updateUser)
    .delete(checkPermission('delete_users'), deleteUser);

router
    .route('/:id/roles')
    .put(checkPermission('manage_user_roles'), updateUserRoles);

module.exports = router;
