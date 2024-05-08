const express = require('express');
const {
    listPDS,
    createPDS,
    deletePDS,
    updatePDS,
    getPDSById,
} = require('../../middlewares/pdsMiddleware');

const {
    authenticateToken,
} = require('../../middlewares/authenticationMiddlewares');

const router = express.Router();

router.get('/', authenticateToken, listPDS);
router.post('/', createPDS);
router.get('/:pdsId', authenticateToken, getPDSById);
router.put('/:pdsId', authenticateToken, updatePDS);
router.delete('/:pdsId', authenticateToken, deletePDS);

module.exports = express.Router().use('/pds', router);