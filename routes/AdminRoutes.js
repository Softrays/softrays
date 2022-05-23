const express = require("express");
const router = express.Router();

const adminController = require("../Controllers/AdminController");
const { ensureAuthenticated } = require("../config/auth-admin");

// ADMIN LOGIN
router
  .route("/")
  .get(adminController.adminLoginPage)
  .post(adminController.loginAdmin);

// ADMIN REGISTER
router
  .route("/register")
  .get(adminController.adminRegisterPage)
  .post(adminController.createNewAdmin);

// ADMIN DASHBOARD
router
  .route("/dashboard")
  .get(ensureAuthenticated, adminController.getDashboard);

// DELETE ADMIN ROUTE
router.route("/delete").post(ensureAuthenticated, adminController.deleteAdmin);

// VERIFY ADMIN
router.route("/verify").post(ensureAuthenticated, adminController.verifyAdmin);

// REGISTERED STUDENT ROUTES
router
  .route("/registered-student")
  .get(ensureAuthenticated, adminController.getRegistertedStudent);

router
  .route("/registered-student/:page")
  .get(ensureAuthenticated, adminController.getRegistertedStudentParams);

// ADMIN PROFILE
router
  .route("/profile")
  .get(ensureAuthenticated, adminController.adminProfile)
  .post(ensureAuthenticated, adminController.editProfile);

// CHANGE ADMIN PASSWORD
router
  .route("/change-password")
  .post(ensureAuthenticated, adminController.changeAdminPassword);

// FORGET PASSWORD
router
  .route("/reset-password")
  .get(adminController.resetPasswordPage)
  .post(adminController.resetPassword);

// PASSPORT ROUTE
router
  .route("/upload-passport")
  .post(ensureAuthenticated, adminController.uploadPassport);

// CERTIFICATE ROUTE
router
  .route("/upload-certificate")
  .get(ensureAuthenticated, adminController.uploadCert)
  .post(ensureAuthenticated, adminController.uploadCertAdmin);
// LOGOUT
router.get("/logout", ensureAuthenticated, adminController.logout);

module.exports = router;
