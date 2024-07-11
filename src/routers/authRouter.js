const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.route("/register").post(authController.register);
router.route("/login").get(authController.login);
router.route("/logout").post(authController.logout);

module.exports = router;
