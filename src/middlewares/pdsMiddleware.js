const { default: mongoose } = require('mongoose');
const PDS = require('../database/models/employee/PDS');
const User = require('../database/models/authentication/user');
const { USERNAME_ID_START, EMPLOYEE } = require('../constants');
const { hashPassword } = require('./authenticationMiddlewares');
const { Role } = require('../database/models/authentication/role');

// Middleware function to list PDS documents with pagination and search
const listPDS = async (req, res, next) => {
    try {
        // Extract pagination parameters from query string
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Extract search query from query string
        const searchQuery = req.query.search;

        // Construct query object for partial match search
        const searchFilter = searchQuery ? {
            $or: [
                { 'personal_information.name.firstname': { $regex: searchQuery, $options: 'i' } },
                { 'personal_information.name.lastname': { $regex: searchQuery, $options: 'i' } },
                { 'personal_information.name.middlename': { $regex: searchQuery, $options: 'i' } }
            ]
        } : {};

        // Query for PDS documents with pagination, search, and select specific fields
        const pdsList = await PDS.find(searchFilter)
            .select('personal_information')
            .skip((page - 1) * limit)
            .limit(limit);

        // Count total number of documents for pagination
        const totalDocuments = await PDS.countDocuments(searchFilter);

        // Calculate total number of pages
        const totalPages = Math.ceil(totalDocuments / limit);

        res.json({
            page,
            totalPages,
            totalCount: totalDocuments,
            data: pdsList
        });
    } catch (error) {
        next(error);
    }
};

// Middleware function to create a new PDS document
const createPDS = async (req, res, next) => {
    try {
        let userId = req.body.user_id;
        let targetUser = null;
        let hasAccount = false;
        let returnData = {};

        if (userId && !mongoose.isValidObjectId(userId)) {
            return res.status(404).end('User not found');
        }

        if (userId) {
            delete req.body.userId;

            targetUser = await User.findById(userId);

            if (!mongoose.isValidObjectId(userId)) {
                return res.status(404).end('User not found');
            }
        }

        // assumes that required fields are available
        const newPDS = new PDS(req.body);
        const savedPDS = await newPDS.save();

        returnData.pds = savedPDS;

        if (!targetUser) {
            let username = savedPDS.personal_information.agency_employee_no;

            let passwordFields = [
                savedPDS.personal_information.name.firstname,
                savedPDS.personal_information.birth_date,
            ];

            passwordFields = passwordFields.map((pf) => (
                pf.trim()
            ));

            let password = passwordFields.join('-');
            let encryptedPassword = await hashPassword(password);

            let existUser = await User.findOne({ username: username });

            if (existUser) {
                return res.status(400).send(`User with '${username}' user name already exists.`);
            }

            const existingRole = await Role.findOne({ code: EMPLOYEE });
            const newUser = new User({
                username: username,
                password: encryptedPassword,
                roles: [existingRole],
                pds: savedPDS,
            });

            await newUser.save();

            returnData.username = username;

            console.log(username, password);
        }
        else {
            targetUser.pds = savedPDS;
            await targetUser.save();

            hasAccount = true;
        }

        returnData.has_account = hasAccount;
        res.status(201).json(returnData);
    } catch (error) {
        if (error?.code === 11000) {
            return res.status(400).send("Employee details already exists.");
        }

        next(error);
    }
};

// Middleware function to delete a PDS document by ID
const deletePDS = async (req, res, next) => {
    try {
        let pdsId = req.params.pdsId;

        if (!mongoose.isValidObjectId(pdsId)) {
            return res.status(404).json({ message: 'PDS not found' });
        }

        const deletedPDS = await PDS.findByIdAndDelete(pdsId);
        if (!deletedPDS) {
            return res.status(404).json({ message: 'PDS not found' });
        }
        res.json({ message: 'PDS deleted successfully' });
    } catch (error) {
        next(error);
    }
};

// Middleware function to update a PDS document by ID
const updatePDS = async (req, res, next) => {
    try {
        let pdsId = req.params.pdsId;

        if (!mongoose.isValidObjectId(pdsId)) {
            return res.status(404).json({ message: 'PDS not found' });
        }

        const updatedPDS = await PDS.findByIdAndUpdate(pdsId, req.body, { new: true });
        if (!updatedPDS) {
            return res.status(404).json({ message: 'PDS not found' });
        }
        res.json(updatedPDS);
    } catch (error) {
        next(error);
    }
};

// Middleware function to retrieve a single PDS document by ID
const getPDSById = async (req, res, next) => {
    try {
        const pdsId = req.params.pdsId;

        if (!mongoose.isValidObjectId(pdsId)) {
            return res.status(404).json({ message: 'PDS not found' });
        }

        const pds = await PDS.findById(pdsId);
        if (!pds) {
            return res.status(404).json({ message: 'PDS not found' });
        }
        res.json(pds);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    listPDS,
    createPDS,
    deletePDS,
    updatePDS,
    getPDSById,
};
