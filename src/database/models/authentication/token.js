const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Token', tokenSchema);