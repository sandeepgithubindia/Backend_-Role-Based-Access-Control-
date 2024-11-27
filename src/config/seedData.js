const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Role = require('../models/Role');
const Permission = require('../models/Permission');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Define default permissions
const defaultPermissions = [
    {
        name: 'read_users',
        description: 'Can view user information',
        resource: 'users',
        action: 'read'
    },
    {
        name: 'create_users',
        description: 'Can create new users',
        resource: 'users',
        action: 'create'
    },
    {
        name: 'update_users',
        description: 'Can update user information',
        resource: 'users',
        action: 'update'
    },
    {
        name: 'delete_users',
        description: 'Can delete users',
        resource: 'users',
        action: 'delete'
    },
    {
        name: 'manage_user_roles',
        description: 'Can manage user roles',
        resource: 'roles',
        action: 'update'
    }
];

// Define default roles
const defaultRoles = [
    {
        name: 'admin',
        description: 'System administrator with full access',
        isDefault: false
    },
    {
        name: 'user',
        description: 'Regular user with limited access',
        isDefault: true
    },
    {
        name: 'moderator',
        description: 'Moderator with elevated access',
        isDefault: false
    }
];

// Define default admin user
const defaultAdmin = {
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123',
    isActive: true
};

const seedData = async () => {
    try {
        // Clear existing data
        await Permission.deleteMany({});
        await Role.deleteMany({});
        await User.deleteMany({});

        console.log('Cleared existing data');

        // Create permissions
        const createdPermissions = await Permission.create(defaultPermissions);
        console.log('Created default permissions');

        // Create roles with permissions
        const adminPermissions = createdPermissions.map(p => p._id);
        const userPermissions = [
            createdPermissions.find(p => p.name === 'read_users')._id
        ];
        const moderatorPermissions = [
            createdPermissions.find(p => p.name === 'read_users')._id,
            createdPermissions.find(p => p.name === 'update_users')._id
        ];

        const roles = await Role.create([
            { ...defaultRoles[0], permissions: adminPermissions },
            { ...defaultRoles[1], permissions: userPermissions },
            { ...defaultRoles[2], permissions: moderatorPermissions }
        ]);
        console.log('Created default roles');

        // Create admin user
        const adminRole = roles.find(role => role.name === 'admin');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(defaultAdmin.password, salt);

        await User.create({
            ...defaultAdmin,
            password: hashedPassword,
            roles: [adminRole._id]
        });
        console.log('Created admin user');

        console.log('Seed completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
