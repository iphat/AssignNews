const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/user.js");

//we combine same path routes in one route here we combine "get" and "post" routes
//1-signup
router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup)
);

//2-Login
 //Passport provides an authenticate() function, which is used as a route middleware to authenticate requests.
router.route("/login")
.get(userController.login)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect: '/login', failureFlash: true}), userController.renderLoginForm);

//3-loggedout
router.get("/logout", userController.logout);

module.exports = router;