const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
//const api_handler = require("app");

mongoose.connect('mongodb://localhost/MyProject', { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', function () {
    console.log("Connected");
})

app.use('/static', express.static('static'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());

app.get("/", (req, res, next) => {
    res.render('index');
    next();
});

app.get("/SelectChapter", (req, res, next) => {
    res.render('select chapter');
    next();
});

// app.get("/Quiz", (req, res, next) => {
//     console.log("Quiz");
//     res.send("Welcome to Quiz Project");
//     next();
// });

// app.get("/Test", (req, res, next) => {
//     console.log("Test");
//     res.send("Welcome to Test Project");
//     next();

// });

app.listen(80, () => {
    console.log("The application started successfully");
  })