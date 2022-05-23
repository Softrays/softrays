require("dotenv").config();
const Student = require("../Models/StudentModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const _ = require("lodash");
const request = require("request");
const { initializePayment, verifyPayment } =
  require("../config/paystack")(request);
const numeral = require("numeral");
const upload = require("../config/multer");

module.exports = {
  // Get the Registration Page
  register: (req, res) => {
    res.locals.title = "Softrays | Register";
    res.render("Users/register");
  },

  // Create a new User
  createNewUser: (req, res) => {
    const price = Number(req.body.price);

    const {
      fullName,
      email,
      phoneNumber,
      address,
      nationality,
      state,
      gender,
      qualification,
      course,
      password,
      password2,
      duration,
    } = req.body;

    let errors = [];

    //Validation
    //Check required fields
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !address ||
      !nationality ||
      !state ||
      !gender ||
      !qualification ||
      !course ||
      !password ||
      !password2
    ) {
      errors.push({ msg: "Please fill in all fields" });
    }

    if (password != password2) {
      errors.push({ msg: "Password do not match" });
    }

    if (password < 8) {
      errors.push({ msg: "Password should be at least 8 characters" });
    }

    if (errors.length > 0) {
      res.locals.title = "Softrays | Register";
      res.render("Users/register", {
        errors,
        fullName,
        email,
        phoneNumber,
        address,
        nationality,
        state,
        gender,
        qualification,
        course,
        password,
        password2,
      });
    } else {
      Student.findOne({ email: email }, function (err, foundStudent) {
        if (foundStudent) {
          res.locals.title = "Softrays | Login";
          errors.push({ msg: "Email is already registered" });
          res.render("Users/register", {
            errors,
            fullName,
            email,
            phoneNumber,
            address,
            nationality,
            state,
            gender,
            qualification,
            course,
            password,
            password2,
          });
        } else {
          const newStudent = new Student({
            fullName,
            email,
            phoneNumber,
            address,
            nationality,
            state,
            gender,
            qualification,
            course,
            price,
            password,
            duration,
          });

          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newStudent.password, salt, function (err, hash) {
              // Store hash in your password DB.
              if (err) throw err;
              // Set password to hash
              newStudent.password = hash;

              //Save the user if !exist
              newStudent
                .save()
                .then((user) => {
                  console.log("new Student Successfully Registered");
                  req.flash(
                    "success_msg",
                    "You have successfully registered, please proceed to login"
                  );
                  res.redirect("/users/login");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    }
  },

  // Login Routes
  userLoginPage: (req, res) => {
    res.locals.title = "Softrays | Login";
    res.render("Users/login");
  },

  userLogin: (req, res, next) => {
    passport.authenticate("students", {
      successRedirect: "/users/dashboard",
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);
  },

  // User Dashboard
  userDashboard: async (req, res) => {
    res.locals.title = "Student Dashboard";
    var perPage = 5;
    var page = req.params.page || 1;

    try {
      const students = await Student.find({ course: req.user.course })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await Student.countDocuments();
      res.render("Users/dashboard", {
        students,
        current: page,
        pages: Math.ceil(count / perPage),
        profile: req.user,
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  userDashboardParams: async (req, res) => {
    res.locals.title = "Student Dashboard";
    var perPage = 5;
    var page = req.params.page || 1;

    try {
      const students = await Student.find({ course: req.user.course })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec();
      const count = await Student.countDocuments();
      res.render("Users/dashboard", {
        students,
        current: page,
        pages: Math.ceil(count / perPage),
        profile: req.user,
      });
    } catch (err) {
      console.log(err.message);
    }
  },

  // User Profile

  getProfile: (req, res) => {
    res.locals.title = "Profile";
    res.render("Users/profile", { profile: req.user });
  },

  editProfile: (req, res) => {
    res.locals.title = "Profile";
    const { fullName, email, phoneNumber, address, nationality, state } = req.body;
    errors = [];
    if (!email || !phoneNumber || !address || !nationality || !state) {
      errors.push({ msg: "Pleas fill in all fields" });
    }
    if (errors.length > 0) {
      res.locals.title = "Profile";
      res.render("Users/profile", {
        fullName,
        errors,
        email,
        phoneNumber,
        address,
        nationality,
        state,
        profile: req.user,
      });
    } else {
      updatedInfo = {
        fullName, 
        email,
        phoneNumber,
        address,
        nationality,
        state,
      };
      Student.findOneAndUpdate(
        { email: req.user.email },
        { $set: updatedInfo },
        { new: true }
      ).exec((err, update) => {
        if (err) throw err;
        if (update) {
          req.flash(
            "success_msg",
            "Your profile has been updated successfully. Note that if you updated your email, it should be used for your next login."
          );
          res.redirect("/users/profile");
        }
      });
    }
  },

  // User Application Form
  applicationForm: (req, res) => {
    res.locals.title = "Print Application Form";
    res.render("Users/print-form", { profile: req.user, numeral: numeral });
  },

  // Paystack Integration
  getPayStack: (req, res) => {
    const ref = req.query.reference;
    verifyPayment(ref, (error, body) => {
      if (error) {
        //handle errors appropriately
        console.log(error);
        return res.send("Error processing payment");
      }
      response = JSON.parse(body);
      const data = _.at(response.data, [
        "reference",
        "amount",
        "status",
        "gateway_response",
        "customer.email",
        "metadata.fullName",
        "paid_at",
      ]);
      [reference, amount, status, gateway_response, email, fullName, paid_at] =
        data;
      // ------------------------------------------------------------------------------------------------
      paymentInfo = {
        reference,
        amount,
        email,
        fullName,
        status,
        gateway_response,
        paid_at,
      };
      Student.findOneAndUpdate(
        { email: req.user.email },
        { $set: { reference: paymentInfo } },
        { new: true }
      ).exec((err, paid) => {
        if (err) throw err;
        if (paid) {
          req.flash("success_msg", "Your Payment is successfully.");
          res.redirect("/users/print-application-form");
        }
      });
    });
  },

  paystackPay: (req, res) => {
    const form = _.pick(req.body, ["amount", "email", "fullName"]);
    // const percentage = 0.016 * form.amount
    // console.log(form);
    form.metadata = {
      fullName: form.fullName,
    };
    // for
    // form.amount * 0.016;
    form.amount *= 100;
    initializePayment(form, (error, body) => {
      if (error) {
        //handle errors
        console.log(error);
        return;
      }
      response = JSON.parse(body);
      // console.log(response);
      res.redirect(response.data.authorization_url);
    });
  },

  // Password Route

  changePasswordFromProfile: async (req, res) => {
    res.locals.title = "Profile";
    let { oldPassword, newPassword, confirmPassword } = req.body;
    errors = [];
    // Checking for errors
    // check if any field was not filled
    if (!oldPassword || !newPassword || !confirmPassword) {
      errors.push({ msg: "Please fill in all fields." });
    }
    // check if the new password is equal to the confirm password
    if (newPassword !== confirmPassword) {
      errors.push({ msg: "Passwords do not match." });
    }
    // check if the password supplied is less than 6 characters
    if (newPassword.length < 8) {
      errors.push({ msg: "Password should be at least 8 characters" });
    }
    // check if the length of errors is greater than 0, if true, its returns back their profile page with corresponding errors else it finds a user with the email already logged in and then check to make sure that the old password supplied is the same as the password already stored in the database.
    if (errors.length > 0) {
      res.render("Users/profile", {
        profile: req.user,
        errors,
        oldPassword,
        newPassword,
        confirmPassword,
      });
    } else {
      const user = await Student.findOne({ email: req.user.email });
      try {
        if (user) {
          bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
            if (err) throw err;
            if (!isMatch) {
              req.flash(
                "error_msg",
                "The old password you entered does not match any record on our database. Please try again."
              );
              res.redirect("/users/profile");
            } else {
              Student.findByIdAndUpdate(
                { _id: user._id },
                { password: newPassword },
                function (err, user) {
                  if (err) {
                    console.log(err);
                  } else {
                    user.password = req.body.newPassword;
                    bcrypt.genSalt(10, function (err, salt) {
                      bcrypt.hash(user.password, salt, function (err, hash) {
                        // Store hash in your password DB.
                        user.password = hash;
                        user
                          .save()
                          .then((user) => {
                            req.flash(
                              "success_msg",
                              "Your Password has been changed successfully."
                            );
                            res.redirect("/users/profile");
                          })
                          .catch((err) => console.log(err));
                      });
                    });
                  }
                }
              );
            }
          });
        }
      } catch (err) {
        console.log(err.message);
      }
    }
  },

  forgetPassword: (req, res) => {
    res.render("Users/forget-password");
  },

  changeForgottenPassword: (req, res) => {
    async.waterfall(
      [
        function (done) {
          crypto.randomBytes(20, (err, buf) => {
            var token = buf.toString("hex");
            done(err, token);
          });
        },
        function (token, done) {
          // console.log(req.body.email)
          Student.findOne({ email: req.body.email }, (err, user) => {
            if (err) {
              console.log(err);
            }
            if (!user) {
              req.flash("error_msg", "No account with that email exists.");
              res.redirect("/forgot-password");
            }
            console.log(user.resetPasswordToken);
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; //1 hour
            user.save((err) => {
              done(err, token, user);
            });
          });
        },
        function (token, user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: "osuyajoshua@gmail.com",
              pass: 244563624,
            },
          });

          var mailOptions = {
            to: user.email,
            from: "noreply@softraysit.com",
            subject: "Softrays Password reset",
            text: `You are receiving this because you (or someone else) have requested to reset your password. Please click on this link to reset your password. \n\n
        https://${req.headers.host}/reset/${token}/\n\n.
          If you did not request this, please ignore this email and your password will remail unchanged.`,
          };

          smtpTransport.sendMail(mailOptions, (err) => {
            req.flash(
              "success_msg",
              "An email has been sent to " +
                user.email +
                " with further instructions."
            );
            done(err, "done");
          });
        },
      ],
      (err) => {
        if (err) console.log(err);
        res.redirect("/users/forgot-password");
      }
    );
  },

  // PASSPORT
  uploadPassport: (req, res) => {
    res.locals.title = "Profile";
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
        res.render("Users/profile", {
          msg: "File too large, image must not be more than 20kb",
          profile: req.user,
          file: `passport`,
        });
      } else {
        if (req.file == undefined) {
          res.render("Users/profile", {
            msg: "Error: No file Selected.",
            profile: req.user,
            file: `passport`,
          });
        } else {
          Student.findOneAndUpdate(
            { email: req.user.email },
            { $set: { image: req.file.filename } },
            { new: true }
          ).exec((err, data) => {
            if (err) {
              console.lof(err);
            } else {
              res.render("Users/profile", {
                msg: "Success! Image Uploaded Successfully",
                profile: req.user,
                file: `/passport/${data.image}`,
              });
            }
          });
        }
      }
    });
  },

  // Logoot
  logout: (req, res) => {
    req.logout();
    req.flash("success_msg", "You have successfully logged out.");
    res.redirect("/users/login");
  },
};
