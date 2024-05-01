const express = require('express');
const {
    register,
    login,
    reset,
    validate,
    logout,
} = require('../../middlewares/authenticationMiddlewares');

const {
    authenticateToken,
} = require("../../middlewares/authenticationMiddlewares");

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset', reset);
router.get('/validate', authenticateToken, validate);
router.post('/logout', logout);

module.exports = router;