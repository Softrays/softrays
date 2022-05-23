const express = require("express");
const router = express.Router();

const userController = require("../Controllers/UserController");
const { ensureAuthenticated } = require("../config/auth");

// REGISTER ROUTE
router
  .route("/register")
  .get(userController.register)
  .post(userController.createNewUser);

// LOGIN ROUTE
router
  .route("/login")
  .get(userController.userLoginPage)
  .post(userController.userLogin);

// DASHBOARD ROUTE
router
  .route("/dashboard")
  .get(ensureAuthenticated, userController.userDashboard);

router
  .route("/dashboard/:page")
  .get(ensureAuthenticated, userController.userDashboardParams);

// PROFILE ROUTE
router
  .route("/profile")
  .get(ensureAuthenticated, userController.getProfile)
  .post(ensureAuthenticated, userController.editProfile);

// APPLICATION FORM ROUTE
router
  .route("/print-application-form")
  .get(ensureAuthenticated, userController.applicationForm);

// PAYSTACK INTEGRATION ROUTE
router
  .route("/paystack/callback")
  .get(ensureAuthenticated, userController.getPayStack);

router
  .route("/paystack/pay")
  .post(ensureAuthenticated, userController.paystackPay);

// PASSWORD ROUTE
router
  .route("/change-password")
  .post(ensureAuthenticated, userController.changePasswordFromProfile);

router
  .route("/forget-password")
  .get(userController.forgetPassword)
  .post(userController.changeForgottenPassword);

// PASSPORT ROUTES
router
  .route("/upload-passport")
  .post(ensureAuthenticated, userController.uploadPassport);

// LOGOUT
router.get("/logout", ensureAuthenticated, userController.logout);
router.get("*", (req, res) => {
  res.send("Page Not FOund");
});
module.exports = router;
