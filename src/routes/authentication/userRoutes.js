const express = require('express');
const {
    lists,
    update,
    destroy,
} = require('../../middlewares/usersMiddleware');

const router = express.Router();

router.get('/', lists);
router.put('/:userId', update);
router.delete('/:userId', destroy);

module.exports = express.Router().use('/user', router);