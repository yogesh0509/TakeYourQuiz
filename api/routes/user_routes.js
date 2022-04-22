const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../models/userModel");
require("dotenv").config();

exports.signup = (req, res, next) => {
    user.find({ email: req.body.email })
        .exec()
        .then(data => {
            if (data.length >= 1) {
                return res.status(409).json({
                    message: "Mail exists"
                });
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: "There is an error",
                            error: err
                        });
                    } else {
                        const User = new user;
                        User._id = new mongoose.Types.ObjectId();
                        User.username = req.body.username;
                        User.email = req.body.email;
                        User.password = hash;

                        User.save()
                            .then(result => {
                                // res.status(201).json({
                                //     message: "User created"
                                // });
                                res.redirect("/");
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                });
                            });
                    }
                });
            }
        });
}

exports.login = (req, res, next) => {
    user.find({ email: req.body.email })
        .exec()
        .then(data => {
            if (data.length < 1) {
                return res.status(401).json({
                    message: "mail does not exist",
                });
            }
            bcrypt.compare(req.body.password, data[0].password, (err, result) => {
                if (err) {
                    return res.status(401).json({
                        message: "Auth failed",
                        error: err
                    });
                }
                if (result) {
                    const token = jwt.sign(
                        {
                            _id: data[0]._id,
                            email: data[0].email,
                            username: data[0].username
                        },
                        process.env.JWT_KEY,
                        {
                            expiresIn: "24h"
                        }
                    );
                    console.log({
                        message: "Auth successful",
                        token: token,
                    })

                    res.cookie('access_token', token, {
                        expires:new Date(Date.now() + 86400000),
                        httpOnly: true
                    });
                    // res.status(200).json({
                    //     message: "Auth Successful", 
                    //     token: token
                    // })
                    next();
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

};

exports.refresh_token = (req, res, next)=>{
    jwt.verify(req.cookies.access_token, process.env.JWT_KEY, (err, authorized_data) =>{
        if(err){
            res.status(403).json({
                message: "access token is absent",
                error: err
            })
        }
        else{
            const refresh_token = jwt.sign(
                {
                    _id: authorized_data._id,
                    email: authorized_data.email,
                    username: authorized_data.username
                },
                process.env.JWT_KEY,
                {
                    expiresIn: "15m"
                }
            );
            res.status(200).json({
                "refresh_token": refresh_token
            })
        }
    })
}