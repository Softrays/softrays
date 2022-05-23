// const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const Student = require("../Models/StudentModel");
const Admin = require("../Models/AdminModel");

module.exports = function (passport) {
  passport.use(
    "students",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        Student.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered.",
              });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password is incorrect." });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.use(
    "admins",
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        Admin.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered.",
              });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) throw err;
              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, { message: "Password is incorrect." });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  //   Serialize and Deserialize User
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    Admin.findById(id, (err, user) => {
      if (err) done(err);
      if (user) {
        done(null, user);
      } else {
        Student.findById(id, (err, user) => {
          if (err) done(err);
          done(null, user);
        });
      }
    });
  });
};
