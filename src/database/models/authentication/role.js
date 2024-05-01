const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const {
    SUPER_ADMIN,
    ADMIN,
} = require('../../../constants');

const ROLES = [
    {
        code: SUPER_ADMIN,
        name: 'Super Admin',
        description: '-',
    },
    {
        code: ADMIN,
        name: 'Admin',
        description: '-',
    },
];

// Role schema
const roleSchema = new Schema({
  code: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  }
});

const Role = mongoose.model('Role', roleSchema);

const initDefaultRoles = async () => {
    try {
        
        for(const role of ROLES) {
            const existingRole = await Role.findOne({ code: role.code });

            if(!existingRole) {
                await Role.create(role);
                console.log(`Role ${role.name}} created.`);
            }
        }

    } catch (error) {
        console.error('Error initializing default roles:', error);
    }
}

module.exports = {
    Role,
    initDefaultRoles,
};