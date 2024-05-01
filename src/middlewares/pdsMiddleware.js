const PDS = require('../database/models/employee/PDS');

// Middleware function to list all PDS documents
const listPDS = async (req, res, next) => {
    try {
        const pdsList = await PDS.find();
        res.json(pdsList);
    } catch (error) {
        next(error);
    }
};

// Middleware function to create a new PDS document
const createPDS = async (req, res, next) => {
    try {
        const newPDS = new PDS(req.body);
        const savedPDS = await newPDS.save();
        res.status(201).json(savedPDS);
    } catch (error) {
        next(error);
    }
};

// Middleware function to delete a PDS document by ID
const deletePDS = async (req, res, next) => {
    try {
        const deletedPDS = await PDS.findByIdAndDelete(req.params.pdsId);
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
        const updatedPDS = await PDS.findByIdAndUpdate(req.params.pdsId, req.body, { new: true });
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
