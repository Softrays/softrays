const Admin = require("../Models/AdminModel");
const Student = require("../Models/StudentModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const async = require("async");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const upload = require(`../config/multer`);

module.exports = {
  adminLoginPage: (req, res) => {
    res.locals.title = "Softrays Admin | Login";
    res.render("Admin/login");
  },

  adminRegisterPage: (req, res) => {
    res.locals.title = "Softrays Admin | Register";
    res.render("Admin/register");
  },

  createNewAdmin: (req, res) => {
    const { fullName, email, phoneNumber, address, password, confirmPassword } =
      req.body;
    let errors = [];
    //Validation
    //Check required fields
    if (
      !fullName ||
      !email ||
      !phoneNumber ||
      !address ||
      !password ||
      !confirmPassword
    ) {
      errors.push({ msg: "Please fill in all fields" });
    }
    if (password != confirmPassword) {
      errors.push({ msg: "Password do not match" });
    }
    if (password < 8) {
      errors.push({ msg: "Password should be at least 8 characters" });
    }
    if (errors.length > 0) {
      res.locals.title = "Softrays Admin | Register";
      res.render("Admin/register", {
        errors,
        fullName,
        email,
        phoneNumber,
        address,
        password,
        confirmPassword,
      });
    } else {
      Admin.findOne({ email: email }, function (err, foundAdmin) {
        if (foundAdmin) {
          res.locals.title = "Softrays Admin | Register";
          errors.push({ msg: "Email is already registered" });
          res.render("Admin/register", {
            errors,
            fullName,
            email,
            phoneNumber,
            address,
            password,
            confirmPassword,
          });
        } else {
          const newAdmin = new Admin({
            fullName,
            email,
            phoneNumber,
            address,
            password,
          });
          bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(newAdmin.password, salt, function (err, hash) {
              // Store hash in your password DB.
              if (err) throw err;
              // Set password to hash
              newAdmin.password = hash;
              //Save the user if !exist
              newAdmin
                .save()
                .then((user) => {
                  req.flash(
                    "success_msg",
                    "You have successfully registered as an admin, please proceed to login."
                  );
                  res.redirect("/admin");
                })
                .catch((err) => console.log(err));
            });
          });
        }
      });
    }
  },

  loginAdmin: (req, res, next) => {
    passport.authenticate("admins", {
      successRedirect: "/admin/dashboard",
      failureRedirect: "/admin",
      failureFlash: true,
    })(req, res, next);
  },

  // Admin Dashboard
  getDashboard: (req, res) => {
    res.locals.title = "Admin Dashboard";
    Admin.find({}, (err, foundAdmin) => {
      if (err) {
        console.log(err);
      }
      if (foundAdmin) {
        if (req.user.admin == true) {
          Student.find({}, (err, foundStudents) => {
            if (err) throw err;
            if (foundStudents) {
              res.render("Admin/dashboard", {
                profile: req.user,
                admins: foundAdmin,
                students: foundStudents,
              });
            }
          });
        } else {
          req.flash(
            "error_msg",
            "Your Admin status has not been verified, check back later."
          );
          res.redirect("/admin");
        }
      }
    });
  },

  // Delete Admin
  deleteAdmin: (req, res) => {
    Admin.findByIdAndDelete({ _id: req.body.itemId }).exec(
      (err, deletedItem) => {
        if (err) throw err;
        if (deletedItem) {
          req.flash("success_msg", "Admin has been successfully deleted.");
          res.redirect("/admin/dashboard");
        } else {
          Student.findByIdAndDelete({ _id: req.body.itemId }).exec(
            (err, deletedItem) => {
              if (err) throw err;
              if (deletedItem) {
                req.flash(
                  "success_msg",
                  "Student record has been successfully deleted."
                );
                res.redirect("/admin/registered-student");
              }
            }
          );
        }
      }
    );
  },

  // Verify Admin
  verifyAdmin: (req, res) => {
    Admin.findByIdAndUpdate(
      req.body.itemId,
      { $set: { admin: true } },
      { new: true }
    ).exec((err, verifiedAdmin) => {
      if (err) throw err;
      if (verifiedAdmin) {
        req.flash("success_msg", "Admin has been successfully verified.");
        res.redirect("/admin/dashboard");
      }
    });
  },
  // Get Registered Students
  getRegistertedStudent: async (req, res) => {
    res.locals.title = "Registered Students";
    var perPage = 30;
    var page = req.params.page || 1;
    const foundAdmins = await Admin.find({ email: req.user.email });
    try {
      if (foundAdmins) {
        const students = await Student.find({})
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec();

        const count = await Student.countDocuments();
        res.render("Admin/registered-student", {
          students,
          current: page,
          pages: Math.ceil(count / perPage),
          profile: req.user,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  },

  getRegistertedStudentParams: async (req, res) => {
    res.locals.title = "Registered Students";
    var perPage = 30;
    var page = req.params.page || 1;

    const foundAdmins = await Admin.find({ email: req.user.email });
    try {
      if (foundAdmins) {
        const students = await Student.find({})
          .skip(perPage * page - perPage)
          .limit(perPage)
          .exec();

        const count = await Student.countDocuments();
        res.render("Admin/registered-student", {
          students,
          current: page,
          pages: Math.ceil(count / perPage),
          profile: req.user,
        });
      }
    } catch (err) {
      console.log(err.message);
    }
  },

  // Admin Profile
  adminProfile: (req, res) => {
    res.locals.title = "Profile";
    res.render("Admin/profile", { profile: req.user });
  },

  editProfile: (req, res) => {
    res.locals.title = "Profile";
    const { fullName, email, phoneNumber, address } = req.body;
    errors = [];
    if (!email || !phoneNumber || !address || !fullName) {
      errors.push({ msg: "Pleas fill in all fields" });
    }
    if (errors.length > 0) {
      res.locals.title = "Profile";
      res.render("Admin/profile", {
        fullName,
        errors,
        email,
        phoneNumber,
        address,
        profile: req.user,
      });
    } else {
      updatedInfo = {
        fullName,
        email,
        phoneNumber,
        address,
      };
      Admin.findOneAndUpdate(
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
          res.redirect("/admin/profile");
        }
      });
    }
  },

  // ADMIN PASSWORD
  changeAdminPassword: (req, res) => {
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
      res.render("Admin/profile", {
        profile: req.user,
        errors,
        oldPassword,
        newPassword,
        confirmPassword,
      });
    } else {
      Admin.findOne({ email: req.user.email })
        .then((user) => {
          if (user) {
            bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
              if (err) throw err;
              if (!isMatch) {
                req.flash(
                  "error_msg",
                  "The old password you entered does not match any record on our database. Please try again."
                );
                res.redirect("/admin/profile");
              } else {
                Admin.findByIdAndUpdate(
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
                              res.redirect("/admin/profile");
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
        })
        .catch((err) => console.log(err));
    }
  },

  // FORGET PASSWORD
  resetPasswordPage: (req, res) => {
    res.locals.title = "Reset Password";
    res.render("Admin/reset");
  },

  resetPassword: (req, res) => {
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
          Admin.findOne({ email: req.body.email }, (err, user) => {
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
        res.redirect("/admin/forgot-password");
      }
    );
  },

  // PASSPORT ROUTE
  uploadPassport: (req, res) => {
    res.locals.title = "Admin Profile";

    upload(req, res, (err) => {
      if (err) {
        res.render("Admin/profile", {
          msg: "File too large, must not be more than 20kb",
          profile: req.user,
          file: `passport`,
        });
      } else {
        if (req.file == undefined) {
          res.render("Admin/profile", {
            msg: "Error: No file Selected.",
            profile: req.user,
            file: `passport`,
          });
        } else {
          Admin.findOneAndUpdate(
            { email: req.user.email },
            { $set: { image: req.file.filename } },
            { new: true }
          ).exec((err, success) => {
            if (err) throw err;
            if (success) {
              res.render("Admin/profile", {
                msg: "Success! Image Uploaded Successfully",
                profile: req.user,
                file: `/passport/${success.image}`,
              });
            }
          });
        }
      }
    });
  },

  uploadCert: async (req, res) => {
    res.locals.title = "Upload Certificate";
    await Student.find()
      .then((student) => {
        res.render("Admin/upload", { profile: req.user, students: student });
      })
      .catch((err) => {
        console.log(err.message);
      });
  },

  uploadCertAdmin: (req, res) => {
    console.log(req.body);
  },

  logout: (req, res) => {
    req.logout();
    req.flash("success_msg", "You have successfully logged out.");
    res.redirect("/admin");
  },
};
