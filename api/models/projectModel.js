const mongoose = require('mongoose');

let newSchema = new mongoose.Schema({

    _id: mongoose.Schema.Types.ObjectId,
    configurations:{
        project_name: {type: String, required: true},
        pdf_url: {type: String, required: true},
        time: {
            min: {type: Number},
            sec: {type: Number}
        },
        total_questions: {type: Number, default: 0},
        correct_marks: {type: Number},
        incorrect_marks: {type: Number},
        solution: {
            type: Map,
            of: String,
            default: {}
        }
    },
    attempt: {type: Number, default: 0},
    result:{
        answer: {
            type: Map,
            of: String
        },
        // time:{
        //     type: Map,
        //     of: {
        //         min: {type: Number},
        //         sec: {type: Number}
        //     }
        // },
        total_marks: {type: Number},
        total_correct_questions: {type: Number},
        date: {type: Date}
    },
    // name:{ type: String, required: true },
    // answer: [[]],
    // question_url: [String],
    // solution_url: [String],
    //question_url: String,
    users: {type: mongoose.Schema.Types.ObjectId, ref: 'user'}
});

module.exports = mongoose.model('chapter', newSchema);