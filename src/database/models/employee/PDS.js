const mongoose = require('mongoose');

const pdsSchema = mongoose.Schema({
    // personal information
    personal_information: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // family background
    family_background: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // educational background
    educational_background: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // civil service eligibility
    civil_services: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // work experience
    work_experiences: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // voluntary works
    voluntary_works: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // learning and development
    learning_and_development: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // other information
    other_information: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // questions
    questions: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    // disciplinary_actions
    disciplinary_actions: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    leave: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    }
});

// Create compound index for unique combination of fields
pdsSchema.index({
    'personal_information.name.firstname': 1,
    'personal_information.name.lastname': 1,
    'personal_information.name.middlename': 1,
    'personal_information.birth_date': 1,
    'personal_information.gender': 1
}, { unique: true });

// Middleware function to handle duplicate key error
pdsSchema.post('save', function(error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        // Duplicate key error
        return next(new Error('Employee with this combination already exists'));
    }
    next(error);
});

module.exports = mongoose.model('PDS', pdsSchema);