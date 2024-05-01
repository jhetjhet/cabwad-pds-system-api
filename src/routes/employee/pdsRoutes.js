const express = require('express');
const {
    listPDS,
    createPDS,
    deletePDS,
    updatePDS,
    getPDSById,
} = require('../../middlewares/pdsMiddleware');

const router = express.Router();

router.get('/', listPDS);
router.post('/', createPDS);
router.get('/:pdsId', getPDSById);
router.put('/:pdsId', updatePDS);
router.delete('/:pdsId', deletePDS);

module.exports = express.Router().use('/pds', router);