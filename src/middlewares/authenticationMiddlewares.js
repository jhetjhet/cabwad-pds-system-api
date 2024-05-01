const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

const { Role } = require('../database/models/authentication/role');
const User = require('../database/models/authentication/user');
const Token = require('../database/models/authentication/token');

const {
    validationResultMiddleware,
} = require('../middlewares/expressValidator');

const {
    ADMIN,
    SUPER_ADMIN,
} = require('../constants');

const LOGIN_SECRET = process.env.LOGIN_SECRET;
const AUTH_SECRET = process.env.AUTH_SECRET;
const LOGIN_TOKEN_EXPR = process.env.LOGIN_TOKEN_EXPR;
const AUTH_TOKEN_EXPR = process.env.AUTH_TOKEN_EXPR;

function isArraySubset(arr1, arr2) {
    const set2 = new Set(arr2);
    return arr1.every(value => set2.has(value));
}

function signUserToken(user, secret, expiresIn='15m') {
    return jwt.sign({
        user_id: user.id,
    }, secret, { expiresIn });
}

async function hashPassword(password) {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

async function comparePasswords(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(403).send('Token is not valid');
    }

    jwt.verify(token, AUTH_SECRET, async (err, decoded) => {
        if (err) {
            return res.status(403).send('Token is not valid');
        }

        let userId = decoded.user_id;

        const authUser = await User.findById(userId).populate('roles');

        req.authUser = authUser;

        next();
    });
}

const hasRolesMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if(!req.authUser) {
            return res.status(403).send('Unauthorized access.');
        }

        let userRoles = req.authUser.roles.map((role) => role.code);

        if(userRoles.includes(SUPER_ADMIN)) {
            return next();
        }

        if(!isArraySubset(requiredRoles, userRoles)) {
            return res.status(403).send('Unauthorized access.');
        }

        next();
    };
}

const register = [
    body('username').notEmpty().isString(),
    body('password').notEmpty().isString(),
    body('roles').notEmpty().isArray(),
    validationResultMiddleware,
    async (req, res, next) => {
        try {
            const {
                username,
                password,
                roles,
            } = req.body;

            let roleObjcts = [];
    
            let existUser = await User.findOne({ username: username });
            
            if(existUser) {
                return res.status(400).send(`User with '${username}' user name already exists.`);
            }
        
            for (const role of roles) {
                const existingRole = await Role.findOne({ code: role });

                if(!existingRole) {
                    return res.status(400).end(`Role with ${role} code doesnt exists`);
                }
        
                roleObjcts.push(existingRole);
            }

            if(roleObjcts.length === 0) {
                return res.status(400).send(`User must have at least one role.`);
            }
        
            let encryptedPassword = await hashPassword(password);
            
            const newUser = new User({
                username: username,
                password: encryptedPassword,
                roles: roleObjcts,
            });
        
            await newUser.save();
    
            return res.json(newUser);
        } catch (error) {
            return next(error);
        }
    }
]

const login = [
    body('username').notEmpty().isString(),
    body('password').notEmpty().isString(),
    validationResultMiddleware,
    async (req, res, next) => {
        try {
            const {
                username,
                password,
            } = req.body;

            const user = await User.findOne({ username: username });

            if(!user) {
                return res.status(401).send('Invalid username or password');
            }

            await Token.deleteMany({user_id: user.id});

            let isPasswordValid = await comparePasswords(password, user.password);

            if(!isPasswordValid) {
                return res.status(401).send('Invalid username or password');
            }

            // generate token
            const loginToken = signUserToken(user, LOGIN_SECRET, LOGIN_TOKEN_EXPR);
            const authToken = signUserToken(user, AUTH_SECRET, AUTH_TOKEN_EXPR);

            // record token to be use for refreshing token
            const token = new Token();
            token.user_id = user;
            token.token = loginToken;
            await token.save();

            return res.json({
                token: authToken,
                reset: loginToken,
            });
        } catch (error) {
            return next(error);
        }
    }
]

const validate = (req, res, next) => {
    return res.json(req.authUser);
}

const reset = [
    body('token').notEmpty().isString(),
    validationResultMiddleware,
    async (req, res, next) => {
        try {
            const { token } = req.body;

            jwt.verify(token, LOGIN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).send('Token is not valid');
                }
        
                let userId = decoded.user_id;
        
                const rToken = await Token.findOne({ user_id: userId });
        
                if(!rToken || rToken.token !== token) {
                    return res.status(403).send('Token is not valid');
                }
        
                const authUser = await User.findById(userId).populate('roles');
                
                const authToken = signUserToken(authUser, AUTH_SECRET, AUTH_TOKEN_EXPR);
            
                return res.json({
                    token: authToken,
                });
            });
        } catch (error) {
            return next(error);
        }
    }
]

const logout = [
    body('token').notEmpty().isString(),
    validationResultMiddleware,
    async (req, res, next) => {
        try {
            const { token } = req.body;

            jwt.verify(token, LOGIN_SECRET, async (err, decoded) => {
                if (err) {
                    return res.status(403).send('Token is not valid');
                }
        
                let userId = decoded.user_id;
        
                const rToken = await Token.findOne({ user_id: userId });
        
                if(!rToken || rToken.token !== token) {
                    return res.status(403).send('Token is not valid');
                }
        
                await Token.deleteMany({ user_id: userId });

                return res.status(200).end();
            });
        } catch (error) {
            return next(error);
        }
    }
]

module.exports = {
    hashPassword,
    authenticateToken,
    hasRolesMiddleware,
    register,
    login,
    reset,
    validate,
    logout,
}