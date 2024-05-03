const mongoose = require('mongoose');

let pdsStructure = {
    personal_information: {
        name: {
            firstname: "",
            lastname: "",
            middlename: "",
            extension: "",
        },
        birth_date: "",
        birth_place: "",
        gender: "",
        citizenship: {
            value: "",
            is_dual: false,
            by_birth: false,
            by_naturalization: false,
            country: "",
        },
        civil_status: "",
        height: 0,
        weight: 0,
        blood_type: "",
        gsis_no: "",
        philhealth_no: "",
        sss_no: "",
        tin_no: "",
        agency_employee_no: "",
        residential_address: {
            house_no: "",
            street: "",
            subdivision: "",
            barangay: "",
            city: "",
            province: "",
            zipcode: "",
        },
        residentail_permanent_is_same: false,
        permanent_address: {
            house_no: "",
            street: "",
            subdivision: "",
            barangay: "",
            city: "",
            province: "",
            zipcode: "",
        },
        telephone_no: "",
        mobile_no: "",
        email: "",
    },
    familyBackground: {
        spouse_name: {
            firstname: "",
            lastname: "",
            middlename: "",
            extension: "",
        },
        childrens: [
            {
                fullname: "",
                birth_date: "",
            }
        ],
        occupation: "",
        employer_business_name: "",
        business_address: "",
        telephone_no: "",
        fathers_name: {
            firstname: "",
            lastname: "",
            middlename: "",
            extension: "",
        },
        mothers_name: {
            firstname: "",
            lastname: "",
            middlename: "",
            extension: "",
        }
    },
    educational_background: {
        elementary: {
            school_name: "",
            degree: "",
            period_of_attendance: {
                from: "",
                to: "",
            },
            highest_unit: "",
            year_graduated: "",
            scholarship: "",
        },
        secondary: {
            school_name: "",
            degree: "",
            period_of_attendance: {
                from: "",
                to: "",
            },
            highest_unit: "",
            year_graduated: "",
            scholarship: "",
        },
        vocational: {
            school_name: "",
            degree: "",
            period_of_attendance: {
                from: "",
                to: "",
            },
            highest_unit: "",
            year_graduated: "",
            scholarship: "",
        },
        college: {
            school_name: "",
            degree: "",
            period_of_attendance: {
                from: "",
                to: "",
            },
            highest_unit: "",
            year_graduated: "",
            scholarship: "",
        },
        graduate_studies: {
            school_name: "",
            degree: "",
            period_of_attendance: {
                from: "",
                to: "",
            },
            highest_unit: "",
            year_graduated: "",
            scholarship: "",
        },
    },
    civil_services: [
        {
            service: "",
            rating: "",
            examination_date: "",
            examination_place: "",
            license_no: "",
            license_validity_date: "",
        }
    ],
    work_experience: [
        {
            from: "",
            to: "",
            title: "",
            department: "",
            salary: "",
            pay_grade: "",
            appointment_status: "",
            govt_service: "",
        },
    ],
    voluntary_works: [
        {
            organization: "",
            from: "",
            to: "",
            hours_no: "",
            position: "",
        }
    ],
    learning_and_development: [
        {
            title: "",
            from: "",
            to: "",
            hours_no: "",
            type: "",
            conducted_by: "",
        }
    ],
    other_information: [
        {
            skill: "",
            recognition: "",
            membership: "",
        }
    ],
    questions: {
        q34: {
            a: "",
            b: "",
            details: "",   
        },
        q35: {
            a: {
                value: "",
                details: "",
            },
            b: {
                value: "",
                details: {
                    date_filed: "",
                    case: "",
                },
            },
        },
        q36: {
            value: "",
            details: "",
        },
        q37: {
            value: "",
            details: "",
        },
        q38: {
            a: {
                value: "",
                details: "",
            },
            b: {
                value: "",
                details: "",
            },
        },
        q37: {
            value: "",
            details: "",
        },
        q40: {
            a: {
                value: "",
                details: "",
            },
            b: {
                value: "",
                details: "",
            },
            c: {
                value: "",
                details: "",
            },
        }
    }
};

// name: {
//     firstname: {
//         type: String,
//         required: true,
//     },
//     lastname: {
//         type: String,
//         required: true,
//     },
//     middlename: {
//         type: String,
//         required: false,
//     },
//     extension: {
//         type: String,
//     },
// },
// birth_date: String,
// birth_place: String,
// gender: String,
// citizenship: {
//     value: String,
//     is_dual: Boolean,
//     by_birth: Boolean,
//     by_naturalization: Boolean,
//     country: String,
// },
// civil_status: String,
// height: Number,
// weight: Number,
// blood_type: String,
// gsis_no: String,
// philhealth_no: String,
// sss_no: String,
// tin_no: String,
// agency_employee_no: String,
// residential_address: {
//     house_no: String,
//     street: String,
//     subdivision: String,
//     barangay: String,
//     city: String,
//     province: String,
//     zipcode: String,
// },
// residentail_permanent_is_same: Boolean,
// permanent_address: {
//     house_no: String,
//     street: String,
//     subdivision: String,
//     barangay: String,
//     city: String,
//     province: String,
//     zipcode: String,
// },
// telephone_no: String,
// mobile_no: String,
// email: String,

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
    }
});

module.exports = mongoose.model('PDS', pdsSchema);