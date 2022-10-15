const express = require("express");
const router = express.Router();
const rateLimiter = require("express-rate-limit");
const { register, login, logout } = require("../controllers/authController");

const apiLimiter = rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message:
    "Too many requets from this IP address, please try again after 15 minutes",
});

router.route("/register").post(apiLimiter, register);

router.route("/login").post(apiLimiter, login);

router.route("/logout").get(logout);

module.exports = router;
