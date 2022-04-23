const express = require('express');
const app = express();
const path = require('path');
const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')

const port = process.env.PORT || 3000

const projectRoutes = require("./api/routes/projectRoutes");
const dashboardRoutes = require("./client/routes/dashboardRoutes");
const User = require("./api/routes/user_routes");

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', function () {
  console.log("Connected");
})

app.use('/static', express.static('./client/static'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, './client/views'));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res, next) => {
  if(req.cookies.access_token){
    res.clearCookie("access_token");
  }
  res.render('index', {Home_state : 'active', Dashboard_state: 'disabled', header: 'Login'});
});

app.post("/login", User.login, (req, res)=>{
  res.redirect("/dashboard");
});

app.get("/Signup", (req, res, next) => {
  res.render('signup', {header: "Create Your Account"});
});

app.get("/result", (req, res) =>{
  res.render("result");
})

app.use("/dashboard/", dashboardRoutes);
app.use("/projectRoutes/", projectRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log("The application started successfully");
})