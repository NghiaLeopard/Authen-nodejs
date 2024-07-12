const express = require("express");
const authController = require("../controllers/authController");
const authPermission = require("../auth/authPermission");

const router = express.Router();

router.route("/login").get(authController.login);
router.route("/register").post(authController.register);
router.route("/logout").post(authController.logout);
router.route("/forgot-password").post(authController.forgotPassword);
router.route("/reset-password").patch(authController.resetPassword);
router
    .route("/change-password")
    .post(authPermission("", true), authController.changePassword);

module.exports = router;
