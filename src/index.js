require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const authenticationRoutes = require('./routes/authentication/authenticationRoutes');
const userRoutes = require('./routes/authentication/userRoutes');
const pdsRoutes = require('./routes/employee/pdsRoutes');

const {
    initDefaultRoles,
} = require('./database/models/authentication/role');

const {
    authenticateToken,
    hasRolesMiddleware,
} = require('./middlewares/authenticationMiddlewares');


const {
    SUPER_ADMIN,
    ADMIN,
} = require('./constants');

const app = express();

const PORT = process.env.PORT || 8000;
const DB_CONNECTION = process.env.DB_CONNECTION;

// Middleware to parse JSON bodies
app.use(cors());
app.use(bodyParser.json());
// app.use('/api', authenticateToken, hasRolesMiddleware([
//     ADMIN,
// ]));

async function initDb() {
    await mongoose.connect(DB_CONNECTION);
}

mongoose.connection.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.use('/auth', authenticationRoutes);

app.use('/api/employee', pdsRoutes);
app.use('/api', userRoutes);

app.get('/api/temp', async (req, res) => {

    await req.authUser.populate('roles');

    return res.json(req.authUser);
});

initDb();
initDefaultRoles();

