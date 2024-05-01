const { json } = require('body-parser');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Role' }] // Reference to Role schema
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

module.exports = mongoose.model('User', userSchema);