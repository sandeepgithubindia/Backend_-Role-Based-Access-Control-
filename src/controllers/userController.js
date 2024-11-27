const User = require('../models/User');
const Role = require('../models/Role');

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

        res.json({
            success: true,
            count: users.length,
            data: users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving users'
        });
    }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .select('-password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving user'
        });
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
    try {
        const { username, email, roles, isActive } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify roles exist if provided
        if (roles) {
            const validRoles = await Role.find({ _id: { $in: roles } });
            if (validRoles.length !== roles.length) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid role(s) specified'
                });
            }
        }

        // Update user fields
        if (username) user.username = username;
        if (email) user.email = email;
        if (roles) user.roles = roles;
        if (typeof isActive !== 'undefined') user.isActive = isActive;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: await User.findById(updatedUser._id)
                .select('-password')
                .populate({
                    path: 'roles',
                    populate: {
                        path: 'permissions'
                    }
                })
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user'
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deleting the last admin user
        const isAdmin = user.roles.some(role => role.name === 'admin');
        if (isAdmin) {
            const adminCount = await User.countDocuments({
                roles: { $in: await Role.find({ name: 'admin' }) }
            });
            
            if (adminCount <= 1) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot delete the last admin user'
                });
            }
        }

        await user.remove();

        res.json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user'
        });
    }
};

// @desc    Update user roles
// @route   PUT /api/users/:id/roles
// @access  Private/Admin
const updateUserRoles = async (req, res) => {
    try {
        const { roles } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify all roles exist
        const validRoles = await Role.find({ _id: { $in: roles } });
        if (validRoles.length !== roles.length) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role(s) specified'
            });
        }

        user.roles = roles;
        await user.save();

        const updatedUser = await User.findById(user._id)
            .select('-password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        console.error('Update user roles error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user roles'
        });
    }
};

module.exports = {
    getUsers,
    getUser,
    updateUser,
    deleteUser,
    updateUserRoles
};
