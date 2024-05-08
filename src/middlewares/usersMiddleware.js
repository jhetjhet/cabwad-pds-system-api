const { Role } = require('../database/models/authentication/role');
const User = require('../database/models/authentication/user');
const PDS = require('../database/models/employee/PDS');
const {
    hashPassword,
} = require("./authenticationMiddlewares");

// Middleware function to list users with pagination and search feature for username and specific role by role code
const lists = async (req, res, next) => {
    try {
        let query = {};

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Search by username
        if (req.query.username) {
            query.username = { $regex: req.query.username, $options: 'i' };
        }

        // Filter by role code
        if (req.query.roleCode) {
            query.roles = { $elemMatch: { roleCode: req.query.roleCode } };
        }

        const users = await User.find(query)
            .skip(skip)
            .limit(limit)
            .populate('roles');

        const totalCount = await User.countDocuments(query);

        for(let user of users) {
            
            if(!user.pds) {
                continue;
            }
            
            let existPds = await PDS.findById(user.pds);
            
            if(!existPds) {
                user.pds = null;
                await user.save();
            }
        }

        res.json({
            users,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            totalCount
        });
    } catch (error) {
        next(error);
    }
};

// Middleware function to update specific user given the user id in url params
const update = async (req, res, next) => {
    try {
        const { userId } = req.params;
        let { username, password, roles } = req.body;

        let toUpdateFields = {
            username,
        }

        const existUser = await User.findById(userId);

        if (!existUser) {
            return res.status(404).end('User not found.');
        }

        if(existUser.username == 'admin') {
            return res.status(400).end('User cannot be edited');
        }

        if (password) {
            password = await hashPassword(password);
            toUpdateFields.password = password;
        }

        if (roles) {
            toUpdateFields.roles = [];
            for (const role of roles) {
                const existingRole = await Role.findOne({ code: role });

                if (!existingRole) {
                    return res.status(400).end(`Role with ${role} code doesnt exists`);
                }

                toUpdateFields.roles.push(existingRole);
            }
        }


        if (!username || username == existUser.username) {
            delete toUpdateFields.username;
        }
        
        if(toUpdateFields.username) {
            const usernameExists = await User.findOne({ username });

            if (usernameExists) {
                return res.status(400).end(`User with "${username}" already exists.`);
            }
        }

        if (toUpdateFields.roles && toUpdateFields.roles.length === 0) {
            return res.status(400).end('User must have at least one role.');
        }

        const updatedUser = await User.findByIdAndUpdate(userId, toUpdateFields);

        if (updatedUser.nModified === 1) {
            return res.json(updatedUser);
        }

        return res.status(200).send('No changes made.');
    } catch (error) {
        next(error);
    }
};

// Middleware function to delete specific user with user id in url params
const destroy = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);

        if(!user) {
            return res.status(404).end('User not found');
        }
        
        if(user.username == 'admin') {
            return res.status(400).end('User cannot be deleted');
        }

        if(user.pds) {
            const pds = await PDS.findById(user.pds);

            if(pds) {
                await PDS.findByIdAndDelete(pds._id);
            }
        }

        await User.findByIdAndDelete(userId);
        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    lists,
    update,
    destroy,
};
