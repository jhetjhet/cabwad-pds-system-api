const { validationResult } = require('express-validator');

const validationResultMiddleware = (req, res, next) => {
    try {
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        return next();
    } catch (error) {
        return next(error);
    }
}

module.exports = {
    validationResultMiddleware,
}