require("dotenv").config();
const express = require("express");
const passport = require("passport");
const flash = require("connect-flash");
const session = require("express-session");
const moment = require("moment");
const request = require("request");
const numeral = require("numeral");
const path = require("path");
// const async = require("async");

// Passport Config
require(`${__dirname}/config/passport`)(passport);
require(`${__dirname}/config/paystack`)(request);

// CALLING THE DATABASE
require(`${__dirname}/config/db`);

require("./config/passport")(passport);
require("./config/paystack")(request);

// CALLING THE DATABASE
require("./config/db");

const app = express();

// BODYPARSER
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Express Session
app.use(
  session({
    secret: "secret_key",
    resave: true,
    saveUninitialized: true,
  })
);

// Middlewares
app.use(passport.initialize());
app.use(passport.session());

let date = "MMMM Do YYYY, h:mm:ss a";
app.locals.moment = moment;
app.locals.date = date;
app.locals.numeral = numeral;

// Connect Flash
app.use(flash());

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

// CREATING ROUTES

app.use("/", require(`${__dirname}/routes/index`));
app.use("/users", require(`${__dirname}/routes/UsersRoutes`));
app.use("/admin", require(`${__dirname}/routes/AdminRoutes`));

app.use("/", require("./routes/index"));
app.use("/users", require("./routes/UsersRoutes"));
app.use("/admin", require("./routes/AdminRoutes"));

// CONNECTING OUR VIEW ENGINE
app.set("view engine", "ejs");

// MAKING THE APPLICATION TO USE STATIC FILES
app.use(express.static("public"));

app.get("*", (req, res) => {
  res.render("Admin/404");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started at port ${PORT}`);
});
