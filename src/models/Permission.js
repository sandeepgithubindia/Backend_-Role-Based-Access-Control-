const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    resource: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'read', 'update', 'delete']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create compound index for resource and action
permissionSchema.index({ resource: 1, action: 1 }, { unique: true });

const Permission = mongoose.model('Permission', permissionSchema);

module.exports = Permission;
