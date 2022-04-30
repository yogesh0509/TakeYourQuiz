const { query } = require("express");
const mongoose = require("mongoose");
const chapter = require("../models/projectModel");

exports.new_chapter = (req, res, next) => {
    const question = new chapter({
        _id: new mongoose.Types.ObjectId(),
        configurations: {
            project_name: req.body.table_name,
            pdf_url: req.file.location
        },
        users: res.locals.user._id
    });
    question.save()
        .then(result => {
            res.status(200).json({
                message: "Question Created successfully",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                message: "Some error occured",
                error: err
            })
        })
}

exports.load_data = (req, res, next) => {
    chapter.find({ users: res.locals.user._id })
        .select("configurations.project_name attempt")
        .exec()
        .then(data => {
            arr = [];
            data.forEach(element => {
                arr.push({
                    project_name: element.configurations.project_name,
                    attempt: element.attempt
                });
            })
            res.status(200).json({
                message: "Success",
                data: arr
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
            next();
        })
};

exports.update_answer = (req, res, next) => {
    chapter.findOne({ "configurations.project_name": req.body.table_name })
        .exec()
        .then((data) => {
            let length = data.configurations.total_questions;
            for (answer of req.body.answer) {
                length++;
                data.configurations.solution.set(String(length), answer);
            }
            data.configurations.total_questions = length;
            data.save()
                .then((user) => {
                    res.status(200).json({
                        message: "Update Success",
                        data: user
                    })
                })
                .catch((err) => {
                    res.status(404).json({
                        message: "Update failed",
                        error: err
                    })
                })
        })
}