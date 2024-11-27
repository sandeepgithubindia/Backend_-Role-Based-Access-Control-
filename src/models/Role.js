const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission'
    }],
    isDefault: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Pre-save middleware to update the updatedAt timestamp
roleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Static method to get default role
roleSchema.statics.getDefaultRole = async function() {
    return await this.findOne({ isDefault: true });
};

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
