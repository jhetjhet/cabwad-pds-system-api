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
});

module.exports = mongoose.model('PDS', pdsSchema);