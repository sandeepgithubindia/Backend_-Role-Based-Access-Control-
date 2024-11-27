const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const protect = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route'
            });
        }

        // Verify token
        const decoded = verifyToken(token);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: 'Token is invalid or expired'
            });
        }

        // Get user from token
        const user = await User.findById(decoded.id)
            .select('-password')
            .populate({
                path: 'roles',
                populate: {
                    path: 'permissions'
                }
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User account is deactivated'
            });
        }

        // Add user to request object
        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route'
        });
    }
};

// Middleware to check for specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const hasRole = req.user.roles.some(role => roles.includes(role.name));
        if (!hasRole) {
            return res.status(403).json({
                success: false,
                message: 'User not authorized to access this route'
            });
        }

        next();
    };
};

// Middleware to check for specific permissions
const checkPermission = (permissionName) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
            }

            const hasPermission = await req.user.hasPermission(permissionName);
            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: 'User does not have required permission'
                });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({
                success: false,
                message: 'Error checking permissions'
            });
        }
    };
};

module.exports = {
    protect,
    authorize,
    checkPermission
};
