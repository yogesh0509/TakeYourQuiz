const chapter = require("../models/projectModel");

exports.fetch_config = (req, res, next) => {
    chapter.findOne({ "configurations.project_name": req.body.table_name })
        .select("configurations attempt")
        .exec()
        .then((result) => {
            res.status(201).json({
                message: "Fetch Successfull",
                data: result
            });
        })
}
exports.update_config = (req, res, next) => {
    chapter.findOne({ "configurations.project_name": req.body.table_name })
        .exec()
        .then((data) => {
            data.configurations.time.min = req.body.min;
            data.configurations.time.sec = req.body.sec;
            data.attempt = 1;
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
};

exports.save_result = (req, res, next) => {

    chapter.findOne({ "configurations.project_name": req.body.table_name })
        .exec()
        .then((data) => {

            //console.log(data);
            const map = new Map(Object.entries(req.body.answer));
            data.result.total_marks = req.body.total_marks;
            data.result.answer = map;
            data.result.total_correct_questions = req.body.total_correct_answers;

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

exports.fetch_result = (req, res, next) => {
    console.log(req.body);
    chapter.findOne({ "configurations.project_name": req.body.table_name })
        .select("result configurations.pdf_url")
        .exec()
        .then((result) => {
            res.status(201).json({
                message: "Fetch Successfull",
                data: result
            });
        })
}

exports.clear_result = (req, res, next) => {
    chapter.findOne({ "configurations.project_name": req.body.table_name })
        .exec()
        .then((data) => {

            data.result.total_marks = null;
            data.result.answer = null;
            data.result.total_correct_questions = null;
            data.attempt = 2;
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
